const fs = require('fs');
const path = require('path');

const source = process.argv[2];
const destination = process.argv[3];

if (!source || !destination) {
    console.log('Give source and destination.');
    process.exit();
}

if (!fs.existsSync(source)) {
    console.log('Source does not exist.');
    process.exit();
}

if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
}

function copy(source, destination) {
    const items = fs.readdirSync(source);
    items.forEach(item => {

        const oldPath = path.join(source, item);
        const newPath = path.join(destination, item);

        if (fs.statSync(oldPath).isFile()) {
            fs.copyFileSync(oldPath, newPath);
            console.log(item, 'copied');
        } 
        else {
            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath);
            }

            copy(oldPath, newPath);
        }
    });
}

copy(source, destination);
console.log('Copy completed.');