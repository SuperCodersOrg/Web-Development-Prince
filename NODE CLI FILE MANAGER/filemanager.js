
const fs = require('fs/promises');
const path = require('path');

const command = process.argv[2];
const fileName = process.argv[3];
const content = process.argv.slice(4).join(' ');

function showHelp() {
    console.log(`
NodeCLI File Manager

Commands:
  create <filename> <content>  Create a new file
  read <filename>              Read a file
  delete <filename>            Delete a file
  list <dirpath>               List files and directories
  --help                       Show help menu

Examples:
  node fileManager.js create notes.txt Hello World
  node fileManager.js read notes.txt
  node fileManager.js delete notes.txt
  node fileManager.js list .
`);
}

async function createFile() {
    if (!fileName) {
        console.log('Please provide a filename.');
        process.exitCode = 1;
        return;
    }

    await fs.appendFile(path.resolve(fileName), content);
    console.log('File created successfully:', fileName);
}

async function readFile() {
    if (!fileName) {
        console.log('Please provide a filename.');
        process.exitCode = 1;
        return;
    }

    const data = await fs.readFile(path.resolve(fileName), 'utf8');
    console.log(data);
}

async function deleteFile() {
    if (!fileName) {
        console.log('Please provide a filename.');
        process.exitCode = 1;
        return;
    }

    await fs.unlink(path.resolve(fileName));
    console.log('File deleted successfully:', fileName);
}

async function listFiles() {
    if (!fileName) {
        console.log('Please provide a directory path.');
        process.exitCode = 1;
        return;
    }

    const files = await fs.readdir(path.resolve(fileName), {
        withFileTypes: true
    });

    if (files.length === 0) {
        console.log('Directory is empty.');
        return;
    }

    files.forEach(function (file) {
        const type = file.isDirectory() ? '[DIR]' : '[FILE]';
        console.log(type, file.name);
    });
}

async function main() {
    try {
        if (!command || command === '--help') {
            showHelp();
        } else if (command === 'create') {
            await createFile();
        } else if (command === 'read') {
            await readFile();
        } else if (command === 'delete') {
            await deleteFile();
        } else if (command === 'list') {
            await listFiles();
        } else {
            console.log('Invalid command. Use --help to see available commands.');
            process.exitCode = 1;
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Error: The specified file or directory does not exist.');
        } else if (error.code === 'EEXIST') {
            console.log('Error: This file already exists.');
        } else if (error.code === 'EACCES' || error.code === 'EPERM') {
            console.log('Error: Permission denied.');
        } else if (error.code === 'EISDIR') {
            console.log('Error: Expected a file, but received a directory.');
        } else {
            console.log('Error:', error.message);
        }

        process.exitCode = 1;
    }
}

main();
