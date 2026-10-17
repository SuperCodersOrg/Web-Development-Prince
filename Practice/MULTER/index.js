const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

const uploadDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static("uploads"));

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.send(`
        <h1>Upload Multiple Files</h1>

        <form action="/upload" method="POST"
              enctype="multipart/form-data">

            <input type="file" name="myfile" multiple>

            <button type="submit">Upload</button>
        </form>
    `);
});

app.post("/upload", upload.array("myfile", 1), (req, res) => {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    if (!req.files || req.files.length === 0) {
        return res.status(400).send("Please select at least one file.");
    }

    const uploadedFiles = req.files.map(file => `
        <li>
            Original name: ${file.originalname}<br>
            Saved as: ${file.filename}<br>
            Size: ${file.size} bytes
        </li>
    `).join("");

    res.send(`
        <h2>Files uploaded successfully!</h2>
        <ul>${uploadedFiles}</ul>
    `);
});

app.get("/gallery", (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const uploadDir = path.join(__dirname, "uploads");

    const files = fs.readdirSync(uploadDir);

    const images = files.map(file => `
        <div style="display: inline-block; margin: 15px;">
            <img
                src="/uploads/${encodeURIComponent(file)}"
                alt="Uploaded image"
                width="200"
                style="height: 150px; object-fit: cover;"
            >
            <p>${file}</p>
        </div>
    `).join("");

    res.send(`
        <h1>My Image Gallery</h1>
        ${images || "<p>No images uploaded yet.</p>"}
    `);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});