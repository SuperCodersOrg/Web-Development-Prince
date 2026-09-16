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

function copyDirectory(sourceDir, destinationDir) {

    const files = fs.readdirSync(sourceDir);

    files.forEach(file => {

        const sourcePath = path.join(sourceDir, file);
        const destinationPath = path.join(destinationDir, file);

        const stats = fs.statSync(sourcePath);

        if (stats.isFile()) {

            fs.copyFileSync(sourcePath, destinationPath);
            console.log(file, 'copied');

        } else if (stats.isDirectory()) {

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath);
            }

            copyDirectory(sourcePath, destinationPath);
        }
    });
}

copyDirectory(source, destination);

console.log('Recursive copying completed.');
