const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = 3400;
const Public = path.join(__dirname, '..', 'public');


app.use(express.json());
app.use(express.static(Public));

app.use(cors());

const studentroutes =require("./students");
const teacherroutes =require("./teacher");
app.use("/students",studentroutes);
app.use("/teacher",teacherroutes);



app.listen(PORT, () => {
    console.log(`ABC College server is running at http://localhost:${PORT}`);
});

// nmp install -g express-generator