const express = require('express');
const Router = express.Router();
const path = require('path');
const fs = require('fs');

const dataFolder = path.join(__dirname, '..','..', 'data');
const Public = path.join(__dirname, '..', 'public');

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
    fs.writeFileSync(file,JSON.stringify(data),'utf8');
    console.log("DATA SAVED SUCCESSFULLY");
}

Router.get('/api/about', (req, res) => {
    res.json(getData(collegeFile));
});

Router.get('/api/courses', (req, res) => {
    res.json(getData(coursesFile));
});

Router.get('/api/courses/:courseName', (req, res) => {

    const courses = getData(coursesFile);

    const course = courses.find((item) => {
        return item.course === req.params.courseName;
    });

    if (course) {
        res.json(course);
    }
    else {
        res.status(404).json({
            message: 'Course not found'
        });
    }
});

Router.get('/api/students', (req, res) => {
    res.json(getData(studentsFile));
});

Router.post('/api/students', (req, res) => {

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

Router.get('/api/facilities', (req, res) => {
    res.json(getData(facilitiesFile));
});

Router.get('/api/placement', (req, res) => {
    res.json(getData(placementFile));
});

Router.get('/api/contact', (req, res) => {
    res.json(getData(contactFile));
});

module.exports =Router;