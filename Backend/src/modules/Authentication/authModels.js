const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Primary Cognito identity
        cognitoSub: {
            type: String,
            unique: true,
            sparse: true,
        },

        // Additional Cognito identities linked to this DevSync account
        cognitoSubAliases: {
            type: [String],
            default: [],
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;