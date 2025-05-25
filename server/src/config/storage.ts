import fs from 'fs';
import path from 'path';
export const getStoragePath = (file:any):string => {
    const storagePath = path.join(__dirname, '../', 'storage', file?.name);
    const directory = path.dirname(storagePath);
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory, {recursive: true});
    }
    return storagePath;
};