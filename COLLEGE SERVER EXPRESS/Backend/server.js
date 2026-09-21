const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 3300;

const dataFolder = path.join(__dirname, '..','..', 'Data');
const Public = path.join(__dirname, '..', 'public');


const router = require("./route/routing.js")

app.use(express.json());
app.use(express.static(Public));
app.use("/",router);


function getData(file) {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
}

function saveData(file, data) {
    fs.writeFileSync(file,JSON.stringify(data),'utf8');
    console.log("DATA SAVED SUCCESSFULLY");
}





app.get('/', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/courses/:courseName', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/students', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/facilities', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/placement', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(Public, 'index.html'));
});


app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`ABC College server is running at http://localhost:${PORT}`);
});