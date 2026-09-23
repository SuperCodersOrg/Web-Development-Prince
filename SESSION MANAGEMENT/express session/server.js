const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const port = 3400;

const { router: authRoutes, isAuthenticated } = require("./route/auth");

const dashboardfile = path.join(__dirname,"protected", "dashboard.html");

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 30 * 10
        }
    })
);

app.use(express.static("public"));

app.use(authRoutes);

app.get("/", (req, res) => {
    res.redirect("/mainmenu.html");
});

app.get("/login", (req, res) => {
    res.redirect("/login.html");
});

app.get("/signup", (req, res) => {
    res.redirect("/signup.html");
});

app.get("/dashboard", isAuthenticated, (req, res) => {
    res.sendFile(dashboardfile);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});