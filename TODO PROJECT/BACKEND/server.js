const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "..", "Data", "tasks.json");
const Public = path.join(__dirname, "..", "public");

app.use(express.json());

app.use(express.static(Public));

function getTasks() {
    let data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
}

function saveTasks(tasks) {
    fs.writeFileSync(dataFile, JSON.stringify(tasks));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(Public,'TODO.html'));
});

app.get("/api/tasks", function (req, res) {
    let tasks = getTasks();
    res.json(tasks);
});


app.post("/api/tasks", function (req, res) {
    let tasks = getTasks();

    let title = req.body.title;
    let desc = req.body.desc;
    if (!title || !desc) {
        return res.status(400).json({
            message: "Title and description are required"
        });
    }
    let newTask = {
        id: Date.now(),
        title: title,
        desc: desc
    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });

});


app.put("/api/tasks/:id", function (req, res) {
    let tasks = getTasks();
    let id = Number(req.params.id);
    let task = tasks.find(function (item) {
        return item.id === id;
    });
    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.title = req.body.title;
    task.desc = req.body.desc;

    saveTasks(tasks);

    res.json({
        message: "Task updated successfully",
        task: task
    });

});


app.delete("/api/tasks/:id", function (req, res) {
    let tasks = getTasks();
    let id = Number(req.params.id);
    let index = tasks.findIndex(function (item) {
        return item.id === id;
    });

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    tasks.splice(index, 1);

    saveTasks(tasks);
    res.json({
        message: "Task deleted successfully"
    });

});


app.listen(PORT, function () {
    console.log(`Server running at http://localhost:${PORT}`);
});