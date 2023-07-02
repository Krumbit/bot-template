import * as fs from 'fs';
import path from 'path';

const allFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
    const fullPath = path.join(__dirname, "..", dirPath);
    const files = fs.readdirSync(fullPath);
    files.forEach((file) => {
        if (fs.statSync(fullPath + "/" + file).isDirectory()) arrayOfFiles = allFiles(dirPath + "/" + file, arrayOfFiles);
        else arrayOfFiles.push(path.join(dirPath, "/", file));
    });
    return arrayOfFiles;
};

export default allFiles;