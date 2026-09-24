const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/students", (req, res) => {
    const students = [
        {
            name: "Prince",
            marks: 85
        },
        {
            name: "keshav",
            marks: 72
        },
        {
            name: "Yogesh",
            marks: 91
        },
        {
            name: "Aryan",
            marks: 91
        }
    ];

    res.render("students", {
        students: students
    });
});

router.get("/add-student", (req, res) => {
    res.render("addstudent");
});

router.get("/about", (req, res) => {
    res.render("about");
});

module.exports = router;