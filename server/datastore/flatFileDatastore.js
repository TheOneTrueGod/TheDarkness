import fs from 'fs';
import path from 'path';

function loadDataFromFile(fileName) {
    if (!fs.existsSync(fileName)) {
        return undefined;
    }

    const fileContents = fs.readFileSync(fileName);
    return fileContents;
}

function saveDataToFile(fileName, dataToWrite) {
    const dirname = path.dirname(fileName);

    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(fileName, dataToWrite);
}

export {
    loadDataFromFile,
    saveDataToFile,
}