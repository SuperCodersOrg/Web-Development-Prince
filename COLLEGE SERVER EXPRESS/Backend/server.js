const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 3300;

const dataFolder = path.join(__dirname, '..', 'Data');
const frontendFolder = path.join(__dirname, '..', 'Frontend');

const collegeFile = path.join(dataFolder, 'college.json');
const coursesFile = path.join(dataFolder, 'courses.json');
const studentsFile = path.join(dataFolder, 'students.json');
const facilitiesFile = path.join(dataFolder, 'facilities.json');
const placementFile = path.join(dataFolder, 'placement.json');
const contactFile = path.join(dataFolder, 'contact.json');

app.use(express.json());
app.use(express.static(frontendFolder));

function getData(file) {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
}

function saveData(file, data) {
    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2),
        'utf8'
    );
}


app.get('/api/about', (req, res) => {
    res.json(getData(collegeFile));
});

app.get('/api/courses', (req, res) => {
    res.json(getData(coursesFile));
});

app.get('/api/courses/:courseName', (req, res) => {

    const courses = getData(coursesFile);

    const course = courses.find((item) => {
        return item.course === req.params.courseName;
    });

    if (course) {
        res.json(course);
    } else {
        res.status(404).json({
            message: 'Course not found'
        });
    }
});

app.get('/api/students', (req, res) => {
    res.json(getData(studentsFile));
});

app.post('/api/students', (req, res) => {

    const student = req.body;

    if (!student.name || !student.course || !student.year) {
        res.status(400).json({
            message: 'Please fill all details.'
        });
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

    res.status(201).json({
        message: 'Student registered successfully.',
        student: newStudent
    });
});

app.get('/api/facilities', (req, res) => {
    res.json(getData(facilitiesFile));
});

app.get('/api/placement', (req, res) => {
    res.json(getData(placementFile));
});

app.get('/api/contact', (req, res) => {
    res.json(getData(contactFile));
});




app.get('/', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/courses/:courseName', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/students', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/facilities', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/placement', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});


app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`ABC College server is running at http://localhost:${PORT}`);
});