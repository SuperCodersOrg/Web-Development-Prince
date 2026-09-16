const express = require(express);const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const dataFile = path.join(__dirname, 'data.json');
const studentFile = path.join(__dirname, 'registered_students.txt');
const frontendFolder = path.join(__dirname, '..', 'Frontend');

function getData() {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data));
}

function sendJSON(res, data) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(data));
}

function sendFile(res, fileName) {

    const filePath = path.join(frontendFolder, fileName);

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(500);
            res.end('500 - Server Error');
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(data);
    });
}

function registerStudent(req, res) {

    let body = '';

    req.on('data', data => {
        body += data;
    });

    req.on('end', () => {

        const student = JSON.parse(body);
        const data = getData();

        if (!student.name || !student.course || !student.year) {

            res.writeHead(400, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                message: 'Please fill all details.'
            }));

            return;
        }

        const newStudent = {
            id: data.students.length + 1,
            name: student.name,
            course: student.course,
            year: student.year
        };

        data.students.push(newStudent);

        saveData(data);

        fs.appendFileSync(
            studentFile,
            newStudent.name + '\n'
        );

        res.writeHead(201, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            message: 'Student registered successfully.',
            student: newStudent
        }));
    });
}

const server = http.createServer((req, res) => {

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const route = url.pathname;

    const data = getData();

    const isJSON = req.headers['content-type'] && req.headers['content-type'].includes('application/json');

    if (req.method === 'GET' && route === '/') {
        sendFile(res, 'index.html');
        return;
    }

    if (req.method === 'GET' && route === '/script.js') {

        fs.readFile(
            path.join(frontendFolder, 'script.js'),
            (error, data) => {

                if (error) {
                    res.writeHead(404);
                    res.end('File Not Found');
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/javascript'
                });

                res.end(data);
            }
        );

        return;
    }

    if (req.method === 'POST' && route === '/students') {
        registerStudent(req, res);
        return;
    }

    if (req.method === 'GET' && route === '/about') {

        if (isJSON) {
            sendJSON(res, data.college);
        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    if (req.method === 'GET' && route === '/courses') {

        if (isJSON) {

            const courseName = url.searchParams.get('name');

            if (courseName) {

                const course = data.courses.find(
                    course => course.name === courseName
                );

                if (course) {
                    sendJSON(res, course);
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        message: 'Course not found.'
                    }));
                }

            } else {
                sendJSON(res, data.courses);
            }

        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    if (req.method === 'GET' && route === '/students') {

        if (isJSON) {
            sendJSON(res, data.students);
        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    if (req.method === 'GET' && route === '/register') {
        sendFile(res, 'index.html');
        return;
    }

    if (req.method === 'GET' && route === '/facilities') {

        if (isJSON) {
            sendJSON(res, data.facilities);
        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    if (req.method === 'GET' && route === '/placement') {

        if (isJSON) {
            sendJSON(res, data.placement);
        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    if (req.method === 'GET' && route === '/contact') {

        if (isJSON) {
            sendJSON(res, data.contact);
        } else {
            sendFile(res, 'index.html');
        }

        return;
    }

    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    res.end('404 - Page Not Found');
});

server.listen(PORT, () => {
    console.log(`ABC College server is running at http://localhost:${PORT}`);
});
