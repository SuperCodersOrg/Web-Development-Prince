const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
             res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
             res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: username,
            email: email,
            password: hashedPassword
        });

     res.render("dashboard",
             {  username,
             email
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const verify = await bcrypt.compare(password, user.password);

        if (!verify) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign( { userId: user._id },process.env.JWT_SECRET, { expiresIn: "5h" }
        );

        res.render("dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = { signup, login };