const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_76hvEEvaG",
      userPoolClientId: "7rh8adj5l0j2ji4upvd14jkj60",

      loginWith: {
        email: true,
        oauth: {
          domain:
            "devsync.auth.ap-south-1.amazoncognito.com",
          scopes: ["openid", "email"],
          redirectSignIn: ["http://localhost:5173"],
          redirectSignOut: ["http://localhost:5173"],
          responseType: "code",
        },
      },
    },
  },
};

export default amplifyConfig;