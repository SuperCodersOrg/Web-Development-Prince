const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const SecretKey = "Yogesh13209";
const router = express.Router();
const fs=require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "..", "DATA");
 const userFile = path.join(dataFolder, "users.json");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
function getData(file) {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
}

function saveData(file, data) {
    fs.writeFileSync(file,JSON.stringify(data),'utf8');
    console.log("DATA SAVED SUCCESSFULLY");
}

function setUser(id, user) {
    return jwt.sign(
        {
            id: id,
            username: user.username,
            email: user.email
        },
        SecretKey,
        {
            expiresIn: "1h"
        }
    );
}

function getUser(token) {
    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, SecretKey);
    } catch (error) {
        return null;
    }
}

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    let users=getData(userFile);

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.send("User already exists");
    }

    const user = {
        id: users.length + 1,
        username,
        email,
        password
    };

    users.push(user);
    saveData(userFile, users);

    res.redirect("/login");
});

router.get("/", (req, res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    let users = getData(userFile);

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.send("Invalid email or password");
    }

    const token = setUser(user.id, user);

    res.cookie("token", token, {
        httpOnly: true
    });

    res.redirect("/dashboard");
});
router.get("/forgot-password",(req,res) =>{

     res.render("forgot-password"); 
    }
);
router.post("/forgot-password",(req,res)=>{
    const {email} = req.body;
    let users=getData(userFile);
    const user = users.find(user => user.email === email);
     if (!user){
     return res.send("No account found with this email");
     }
     const resetToken=jwt.sign({
        id:user.id,
        email:user.email
     },
     SecretKey,{
        expiresIn:"3min"
     }
    );

    const resetLink = `http://localhost:8000/reset-password/${resetToken}`;

    const mailOptions = {
        from: "123@gmail.com",
        to: user.email,
        subject: "Password Reset",
        text: `Hello ${user.username},

Click the link below to reset your password:

${resetLink}

This link will expire in 3 minutes.`
    };

    transporter.sendMail(mailOptions, (error,info) => {
        if (error) {
            console.log(error);
            return res.send("Failed to send reset email");
        }

        console.log("Email sent:", info.response);
        res.send("Password reset link has been sent to your email");
    });
});
router.get("/reset-password/:token", (req, res) => {
    const { token } = req.params;

    const user = getUser(token);

    if (!user) {
        return res.send("Invalid or expired reset link");
    }

    res.render("reset-password", {
        token
    });
});

router.post("/reset-password/:token", (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = getUser(token);

    if (!decoded) {
        return res.send("Invalid or expired reset link");
    }

 let users = getData(userFile);
   const user = users.find(
    user => user.id === decoded.id
   );

    if (!user) {
        return res.send("User not found");
    }

    user.password = password;
    saveData(userFile, users);

    res.send("Password reset successfully. You can now login.");
});

module.exports = {
    router,
    setUser,
    getUser,
};