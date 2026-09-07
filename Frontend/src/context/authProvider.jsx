import { AuthContext } from "./authContext";
import { useState, useEffect } from "react";
import { Hub } from "aws-amplify/utils";

import instance from "../api/axios";

import {
  cognitoSignUp,
  cognitoConfirmSignUp,
  cognitoSignIn,
  cognitoGoogleSignIn,
  cognitoSignOut,
  cognitoGetCurrentUser,
  cognitoGetSession,
  cognitoGetUserAttributes,
} from "../api/cognitoAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSession = async (restoreProfile = true) => {
    try {
      const session = await cognitoGetSession();

      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        throw new Error("No Cognito access token found");
      }

      setAccessToken(token);

      if (restoreProfile) {
        const response = await instance.get("/auth/getme", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      }

      return {
        accessToken: token,
      };
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      throw error;
    }
  };

  const createProfile = async ({ name, email }) => {
    const session = await cognitoGetSession();
    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      throw new Error("No Cognito access token found");
    }

    const attributes = await cognitoGetUserAttributes();

    const resolvedEmail =
      email ||
      attributes?.email ||
      "";

    const resolvedName =
      name ||
      attributes?.name ||
      resolvedEmail.split("@")[0];

    if (!resolvedEmail) {
      throw new Error("Unable to determine Cognito user email");
    }

    const response = await instance.post(
      "/auth/profile",
      {
        name: resolvedName,
        email: resolvedEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setUser(response.data.user);
    setAccessToken(token);

    return response.data;
  };

  const restoreGoogleSession = async () => {
    try {
      console.log("Google OAuth callback detected");

      const session = await cognitoGetSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        throw new Error("No Cognito access token found after Google login");
      }

      setAccessToken(token);

      const cognitoUser = await cognitoGetCurrentUser();
      const attributes = await cognitoGetUserAttributes();

      console.log("Google Cognito user:", cognitoUser);
      console.log("Google user attributes:", attributes);

      const email = attributes?.email;
      const name =
        attributes?.name ||
        email?.split("@")[0] ||
        "DevSync User";

      if (!email) {
        throw new Error("Google account email not found");
      }

      const response = await instance.post(
        "/auth/profile",
        {
          name,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data.user);
      setAccessToken(token);

      console.log("Google profile synchronized:", response.data.user);

      window.location.href = "/organization";
    } catch (error) {
      console.error("GOOGLE SESSION RESTORE ERROR:", error);
      console.error("GOOGLE PROFILE ERROR RESPONSE:", error?.response?.data);
      console.error("GOOGLE PROFILE ERROR STATUS:", error?.response?.status);

      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await getSession();
      } catch {
        console.log("No active Cognito session");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log("AUTH EVENT:", payload);

      if (payload.event === "signInWithRedirect") {
        restoreGoogleSession();
      }

      if (payload.event === "signInWithRedirect_failure") {
        console.error(
          "Google sign-in redirect failed:",
          payload.data,
        );

        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const interceptorId = instance.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      instance.interceptors.request.eject(interceptorId);
    };
  }, [accessToken]);

  useEffect(() => {
    const interceptorId = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const errorStatus = error?.response?.status;
        const errorConfig = error?.config;

        if (
          errorStatus === 401 &&
          errorConfig &&
          errorConfig._retry !== true
        ) {
          errorConfig._retry = true;

          try {
            const session = await cognitoGetSession();

            const newToken =
              session.tokens?.accessToken?.toString();

            if (!newToken) {
              throw new Error(
                "Unable to refresh Cognito session",
              );
            }

            setAccessToken(newToken);

            errorConfig.headers.Authorization =
              `Bearer ${newToken}`;

            return instance(errorConfig);
          } catch (refreshError) {
            setUser(null);
            setAccessToken(null);

            throw refreshError;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.response.eject(interceptorId);
    };
  }, []);

  const register = async (credential) => {
    setLoading(true);

    try {
      return await cognitoSignUp({
        email: credential.email,
        password: credential.password,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmRegistration = async ({
    email,
    confirmationCode,
  }) => {
    setLoading(true);

    try {
      return await cognitoConfirmSignUp({
        email,
        confirmationCode,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (credential) => {
    setLoading(true);

    try {
      const response = await cognitoSignIn({
        email: credential.email,
        password: credential.password,
      });

      const session = await getSession(false);

      return {
        ...response,
        accessToken: session.accessToken,
      };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);

    try {
      await cognitoGoogleSignIn();
    } catch (error) {
      if (error?.name === "UserAlreadyAuthenticatedException") {
        console.log(
          "Google Cognito session already exists. Restoring session..."
        );

        await restoreGoogleSession();
        return;
      }

      console.error("GOOGLE LOGIN ERROR:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await cognitoSignOut();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        register,
        confirmRegistration,
        createProfile,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};