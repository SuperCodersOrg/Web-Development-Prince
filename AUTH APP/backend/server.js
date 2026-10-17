
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

        if (!username || !email || !password) {
            return res.render("signup", {
                error: "All fields are required"
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (user) {
            return res.render("signup", {
                error: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

         User.create({
            name: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        res.redirect("/login");

    } catch (error) {
        console.log(error);
        res.render("signup", {
            error: "Something went wrong"
        });
    }
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render("login", {
                error: "All fields are required"
            });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase()});
       if (!user){  return res.render("login", {
                error: "Invalid email or password"
            });
        }
        const verify = await bcrypt.compare(password, user.password);

        if (!verify) {
            return res.render("login", {
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign( { userId: user._id }, process.env.JWT_SECRET,{ expiresIn: "5h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 5 * 60 * 60 * 1000
        });

        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);

        res.render("login", {
            error: "Something went wrong"
        });
    }
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        console.log(user)

        if (!user) {
            res.clearCookie("token");
            return res.redirect("/login");
        }

        res.render("dashboard",
             {  user: user.name,
             email: user.email 
            });
        } catch (error) {
        res.status(500).send("Something went wrong.");
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
    });

    res.redirect("/login");
});

async function startServer() {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.log("Error starting server:", error.message);
    }
}
startServer();
