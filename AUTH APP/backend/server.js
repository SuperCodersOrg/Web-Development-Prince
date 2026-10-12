
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./Models/db");
const User = require("./Models/user");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});


app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate fields before using trim() or length
        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).render("signup", {
                error: "Please fill in all fields."
            });
        }

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (
            normalizedUsername.length < 3 ||
            normalizedUsername.length > 30 ||
            !normalizedEmail ||
            password.length < 6 ||
            password.length > 72
        ) {
            return res.status(400).render("signup", {
                error: "Username must be 3–30 characters and password must be 6–72 characters."
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).render("signup", {
                error: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          name: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        console.log("User created successfully:", newUser._id);

        return res.redirect("/login");

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return res.status(400).render("signup", {
                error: "An account with this email already exists."
            });
        }

        return res.status(500).render("signup", {
            error: "Something went wrong. Please try again."
        });
    }
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ||
            password.length > 72) {
            return res.status(400).render("login", {
                error: "Please enter a valid email and password."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).render("login", {
                error: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 60 * 1000
        });

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).render("login", {
            error: "Something went wrong. Please try again."
        });
    }
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("username email")
            .lean();

        if (!user) {
            res.clearCookie("token");
            return res.redirect("/login");
        }

        res.render("dashboard", { user });
    } catch (error) {
        console.error("Dashboard error:", error.message);
        res.status(500).send("Something went wrong.");
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.redirect("/login");
});

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
            throw new Error("MONGO_URI and JWT_SECRET must be set in .env");
        }

        await connectDB();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exit(1);
    }
};

startServer();
