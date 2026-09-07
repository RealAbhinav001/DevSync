import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect,
} from "aws-amplify/auth";

export const cognitoSignUp = async ({ email, password }) => {
  return await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
    },
  });
};

export const cognitoConfirmSignUp = async ({ email, confirmationCode }) => {
  return await confirmSignUp({
    username: email,
    confirmationCode,
  });
};

export const cognitoSignIn = async ({ email, password }) => {
  try {
    return await signIn({
      username: email,
      password,
    });
  } catch (error) {
    if (error?.name === "UserAlreadyAuthenticatedException") {
      return {
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      };
    }

    throw error;
  }
};

export const cognitoGoogleSignIn = async () => {
  return await signInWithRedirect({
    provider: "Google",
    options: {
      prompt: "select_account",
    },
  });
};

export const cognitoSignOut = async () => {
  return await signOut({
    global: false,
    oauth: {
      redirectUrl: "http://localhost:5173",
    },
  });
};

export const cognitoGetCurrentUser = async () => {
  return await getCurrentUser();
};

export const cognitoGetSession = async () => {
  return await fetchAuthSession();
};

export const cognitoGetUserAttributes = async () => {
  const session = await fetchAuthSession();

  const payload = session.tokens?.idToken?.payload;

  if (!payload) {
    throw new Error("No Cognito ID token found");
  }

  return {
    email: payload.email,
    name: payload.name,
  };
};