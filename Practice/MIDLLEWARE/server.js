const express = require('express');
const fs = require('fs');
const { get } = require('http');
const app = express();
const path = require('path');
const dataFolder = path.join(__dirname, 'DATA');
const userFile = path.join(dataFolder, 'data.json');
app.use(express.json());


function getData(file) {
    const data = fs.readFileSync(file, 'utf8');
    return data;
}

function saveData(file, data) {
    fs.writeFileSync(file,JSON.stringify(data),'utf8');
    console.log("DATA SAVED SUCCESSFULLY");
}

const users = express.Router();
app.get('/user', (req, res) => {
    const userData = getData(userFile);
    res.json(userData);
});

app.use('/users', users);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5000);