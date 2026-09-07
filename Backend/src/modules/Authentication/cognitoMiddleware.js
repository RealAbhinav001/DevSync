const { CognitoJwtVerifier } = require("aws-jwt-verify");
const config = require("../../config/config.js");

const verifier = CognitoJwtVerifier.create({
    userPoolId: config.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    clientId: config.COGNITO_CLIENT_ID,
});

const cognitoMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token not found",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid token format",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format",
            });
        }

        const payload = await verifier.verify(token);

        req.cognitoUser = {
            sub: payload.sub,
        };

        next();
    } catch (error) {
        console.error("Cognito authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = cognitoMiddleware;
