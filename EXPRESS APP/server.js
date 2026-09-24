const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const routes = require("./Route/rout");

app.use("/", routes);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});