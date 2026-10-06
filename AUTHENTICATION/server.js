require("dotenv").config();
const express =require("express");
const app = express();
const Port = 8000;
const Path=require("path");
const cookieParser=require("cookie-parser");


const { router,getUser } = require("./auth/auth");



app.use(express.json());
app.use(express.static("Pulic"));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"views"));

//const authRouter = require("./auth/auth");

app.use("/", router);

function isAuthenticated(req,res,next){
    const token = req.cookies.token;
    const user=getUser(token);

    if(!user){
        return res.redirect("/login");

    }
    req.user=user;
    next();
}

app.get("/dashboard", isAuthenticated, (req, res) => {

    res.render("dashboard", {
        user: req.user
    });

});

app.get("/logout", (req, res) => {

    res.clearCookie("token");

    res.redirect("/login");

});

app.listen(8000, () => {
    console.log(`Server running on http://localhost:${Port}`);
})