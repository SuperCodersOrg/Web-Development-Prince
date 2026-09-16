const fs = require('fs');
const path = require('path');

const source = process.argv[2];
const destination = process.argv[3];

if (!source || !destination) {
    console.log('Please give source and destination directory.');
    process.exit();
}

if (!fs.existsSync(source)) {
    console.log('Source directory does not exist.');
    process.exit();
}

if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
}

const files = fs.readdirSync(source);

files.forEach(file => {

    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(file, 'copied');
    }
});

console.log('Non-recursive copying completed.');
