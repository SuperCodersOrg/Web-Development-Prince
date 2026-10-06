require("dotenv").config();
const express =require("express");
const app = express();
const Port = 8000;
const Path=require("path");
const cookieParser=require("cookie-parser");


const {
    router,
    getUser,
    getRefreshUser,
    setAccessToken
} = require("./auth/auth");




app.use(express.json());
app.use(express.static("Pulic"));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"views"));

//const authRouter = require("./auth/auth");

app.use("/", router);

function isAuthenticated(req,res,next){
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    const user=getUser(accessToken);
    if (user) {
        req.user = user;
        return next();
    }

    const refreshUser = getRefreshUser(refreshToken);

    if (!refreshUser) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.redirect("/login");
    }

    const newAccessToken = setAccessToken(
        refreshUser.id,
        refreshUser
    );

    res.cookie("accessToken", newAccessToken, {

        httpOnly: true,
        maxAge: 60 * 1000,
        sameSite: "lax"

    });

    req.user = refreshUser;
    next();

}

app.get("/dashboard", isAuthenticated, (req, res) => {

    res.render("dashboard", {
        user: req.user
    });

});

app.get("/logout", (req, res) => {

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/login");

});

app.listen(8000, () => {
    console.log(`Server running on http://localhost:${Port}`);
})