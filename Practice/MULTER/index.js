const express = require("express");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        return cb(null,"./uploads");
    },
    filename : function(req,file,cb){
        return cb(null,`${Date.now}-${file.originalname}`);
    },

});
const upload = multer({ storage
});

app.get("/", (req, res) => {
    res.send(`
        <h1>Upload File</h1>

        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="myfile">
            <button type="submit">Upload</button>
        </form>
    `);
});

app.post("/upload", upload.single("myfile"), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    res.send(`
        <h2>File uploaded successfully!</h2>
        <p>Original name: ${req.file.originalname}</p>
        <p>Saved as: ${req.file.filename}</p>
        <p>Size: ${req.file.size} bytes</p>
    `);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});