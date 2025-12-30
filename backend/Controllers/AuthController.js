const UserModel = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User Already Exists, You can Login",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "Signup Successfull", success: true });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Auth Failed! Email is Wrong!",
                success: false,
            });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: "Auth Failed! Password is Wrong!",
                success: false,
            });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.status(201).json({
            message: "Login Successfull",
            success: true,
            jwtToken,
            email,
            name: user.name,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
        });
    }
};

module.exports = {
    signup,
    login,
};
