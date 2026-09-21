const http = require('http');
const fs = require('fs');
const path = require('path');
const  URL = require('url');

const Public = path.join(__dirname, '..', 'public');
const dataPath = path.join(__dirname, 'data.json');

const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const PORT = 3000;

const server = http.createServer((req, res) => {

    const url = new URL(req.url, `http://${req.headers.host}`);

  console.log(url); 
  console.log(req.headers.host);
   console.log(req.url);
   if (url.pathname == "\category"){
const result = [...courses];
const category = url.searchParams.get('category');
const price = url.searchParams.get('price');

if(category){
    result=result.filter(item => item.category === category);
}
if(price){
    result=result.filter(item => item.price === price);
}
res.writeHead(200,{'Content-Type': 'application/json'});

res.end(JSON.stringify(result));
}

});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});