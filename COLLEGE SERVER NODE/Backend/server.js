const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const dataFolder = path.join(__dirname, '..', 'Data');
const frontendFolder = path.join(__dirname, '..', 'Frontend');

const collegeFile = path.join(dataFolder, 'college.json');
const coursesFile = path.join(dataFolder, 'courses.json');
const studentsFile = path.join(dataFolder, 'students.json');
const facilitiesFile = path.join(dataFolder, 'facilities.json');
const placementFile = path.join(dataFolder, 'placement.json');
const contactFile = path.join(dataFolder, 'contact.json');

function getData(file) {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
}

function sendJSON(res, data, statusCode = 200) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(data));
}

function sendFile(res, fileName, contentType) {
    const filePath = path.join(frontendFolder, fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType
        });

        res.end(data);
    });
}

function registerStudent(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        try {
            const student = JSON.parse(body);

            if (!student.name || !student.course || !student.year) {
                sendJSON(res, {
                    message: 'Please fill all details.'
                }, 400);
                return;
            }

            const students = getData(studentsFile);

            const newStudent = {
                id: students.length + 1,
                name: student.name,
                course: student.course,
                year: student.year
            };

            students.push(newStudent);
            saveData(studentsFile, students);

            sendJSON(res, {
                message: 'Student registered successfully.',
                student: newStudent
            }, 201);

        } catch (err) {
            sendJSON(res, {
                message: 'Invalid JSON data.'
            }, 400);
        }
    });
}

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const route = url.pathname;

    if (req.method === 'GET' && route === '/') {
        sendFile(res, 'index.html', 'text/html');
        return;
    }

    if (req.method === 'GET' && route === '/script.js') {
        sendFile(res, 'script.js', 'application/javascript');
        return;
    }

    if (req.method === 'GET' && route === '/api/about') {
        sendJSON(res, getData(collegeFile));
        return;
    }

    if (req.method === 'GET' && route === '/api/courses') {
        sendJSON(res, getData(coursesFile));
        return;
    }

    if (req.method === 'GET' && route.startsWith('/api/courses/')) {
        const courses = getData(coursesFile);
        const courseName = route.split('/')[3];

        const course = courses.find((item) => item.slug === courseName);

        if (course) {
            sendJSON(res, course);
        } else {
            sendJSON(res, {
                message: 'Course not found'
            }, 404);
        }

        return;
    }

    if (req.method === 'GET' && route === '/api/students') {
        sendJSON(res, getData(studentsFile));
        return;
    }

    if (req.method === 'POST' && route === '/api/students') {
        registerStudent(req, res);
        return;
    }

    if (req.method === 'GET' && route === '/api/facilities') {
        sendJSON(res, getData(facilitiesFile));
        return;
    }

    if (req.method === 'GET' && route === '/api/placement') {
        sendJSON(res, getData(placementFile));
        return;
    }

    if (req.method === 'GET' && route === '/api/contact') {
        sendJSON(res, getData(contactFile));
        return;
    }

    if (req.method === 'GET') {
        sendFile(res, 'index.html', 'text/html');
        return;
    }

    sendJSON(res, {
        message: 'Route not found'
    }, 404);
});

server.listen(PORT, () => {
    console.log(`ABC College server is running at http://localhost:${PORT}`);
});
