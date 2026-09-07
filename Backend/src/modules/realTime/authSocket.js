const { CognitoJwtVerifier } = require("aws-jwt-verify");
const userModel = require("../Authentication/authModels.js");
const config = require("../../config/config.js");

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: config.COGNITO_CLIENT_ID,
});

const authSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Token is not found"));
    }

    const payload = await verifier.verify(token);

    const cognitoSub = payload.sub;

    const user = await userModel
      .findOne({
        $or: [
          { cognitoSub },
          { cognitoSubAliases: cognitoSub },
        ],
      })
      .select("-password");
    if (!user) {
      return next(new Error("User profile not found"));
    }

    socket.user = {
      id: user.id,
      _id: user._id,
      name: user.name,
      email: user.email,
      cognitoSub: user.cognitoSub,
    };

    next();
  } catch (error) {
    console.error("Cognito Socket authentication error:", error.message);
    next(new Error("Invalid or expired token"));
  }
};

module.exports = authSocket;