const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataFolder = path.join(__dirname, "..", "data");
const datafile = path.join(dataFolder, "data.json");

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    console.log("DATA SAVED SUCCESSFULLY");
}
 
let users = [];
if (fs.existsSync(datafile)) {
    users = JSON.parse(fs.readFileSync(datafile, "utf8"));
}

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login.html");
    }
}

router.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.send("Fields are empty");
    }

    const existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {
        return res.send("Username already exists");
    }

    const user = {
        username: username,
        password: password
    };

    users.push(user);
    saveData(datafile, users);
    req.session.user = username;
    res.redirect("/dashboard");
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.send("Fields are empty");
    }
    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );
    if (!user) {
        return res.redirect("/login.html");
    }
    req.session.user = username;
    res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login.html");
    });

});

module.exports = {
    router,
    isAuthenticated
};