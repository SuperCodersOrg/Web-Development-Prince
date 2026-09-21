const http = require("http");

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        res.end("Home");
    }

    else if (req.method === "GET" && req.url === "/students") {
        res.end("Students");
    }

    else if (req.method === "POST" && req.url === "/students") {
        res.end("Create student");
    }

    else {
        res.writeHead(404);
        res.end("Not Found");
    }

});

server.listen(3800);