const userModel = require("./authModels.js");

const getmeController = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User successfully found",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const logoutController = (req, res) => {
    try {
        res.status(200).json({
            message: "User successfully logged out",
        });
    } catch (error) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
};

const createProfileController = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const cognitoSub = req.cognitoUser.sub;
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether this Cognito identity is already linked
        let user = await userModel.findOne({
            $or: [
                { cognitoSub },
                { cognitoSubAliases: cognitoSub },
            ],
        });

        if (user) {
            return res.status(200).json({
                message: "User profile already exists",
                user,
            });
        }

        // Check whether the email already belongs to a DevSync account
        const existingEmailUser = await userModel.findOne({
            email: normalizedEmail,
        });

        if (existingEmailUser) {
            // Link this Cognito identity to the existing DevSync account
            if (
                existingEmailUser.cognitoSub !== cognitoSub &&
                !existingEmailUser.cognitoSubAliases.includes(cognitoSub)
            ) {
                existingEmailUser.cognitoSubAliases.push(cognitoSub);
                await existingEmailUser.save();
            }

            return res.status(200).json({
                message: "Cognito identity linked to existing user",
                user: existingEmailUser,
            });
        }

        // Create a completely new DevSync account
        user = await userModel.create({
            cognitoSub,
            name: name.trim(),
            email: normalizedEmail,
        });

        return res.status(201).json({
            message: "User profile successfully created",
            user,
        });
    } catch (error) {
        console.error("Create profile error:", error.message);

        return res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
    getmeController,
    logoutController,
    createProfileController,
};