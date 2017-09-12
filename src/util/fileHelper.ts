'use strict';
import * as path from 'path';

export class FileHelper{
    static getFileName(filePath) : string{
        return filePath.substring(filePath.lastIndexOf(path.sep) + 1);
    }
}