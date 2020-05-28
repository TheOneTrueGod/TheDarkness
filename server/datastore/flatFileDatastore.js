import fs from 'fs';
import path from 'path';

const deleteFolderRecursive = function(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file, index) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  };

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
    deleteFolderRecursive
}