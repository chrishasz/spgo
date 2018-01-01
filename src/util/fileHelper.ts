'use strict';
import * as path from 'path';
import * as vscode from 'vscode';

export class FileHelper{
    static getFileName(filePath) : string{
        return filePath.substring(filePath.lastIndexOf(path.sep) + 1);
    }

    static getFolderFromPath(filePath) : string{
        let relativeFilePath = filePath.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
        return relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
    }
}