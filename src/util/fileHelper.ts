import * as path from 'path';

export function getFileName(filePath) : string{
    return filePath.substring(filePath.lastIndexOf(path.sep) + 1);
}