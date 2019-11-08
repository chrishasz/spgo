'use strict';

import { Uri } from 'vscode';
import * as path from 'path';
import * as vscode from 'vscode';

export class FileHelper {
    
    // make sure we are using the correct OS separator
    public static convertToForwardSlash(sourceDirectory: string): string {
        return sourceDirectory.replace(/\//g, '\\');
    }

    // make sure we are using the correct OS separator
    public static convertToBackSlash(sourceDirectory: string): string {
        return sourceDirectory.replace(/\\/g, '/');
    }

    // make sure we are using the correct OS separator
	public static ensureCorrectPathSeparator(sourceDirectory: string): string {
		return sourceDirectory.replace(/\\/g, path.sep).replace(/\//g, path.sep);
    }
    
    // NOTE: There is always the possibility that this may error if the user tries to get a path with a final folder with containing the '.' character.
    static isPathFile(filePath : Uri) : boolean{
        let finalNode : string = filePath.fsPath.split(path.sep).pop();

        return finalNode.indexOf('.') >= 0;
    }

    static getExtensionRelativeFilePath( filePath : Uri ){
        return filePath.fsPath.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
    }

    static getFileName(filePath: Uri): string {
        return filePath.fsPath.substring(filePath.fsPath.lastIndexOf(path.sep) + 1);
    }

    static getFolderFromPath(filePath: Uri): string {
        let relativeFilePath = this.getExtensionRelativeFilePath( filePath );
        return relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));

        // let relativeFilePath : string = filePath.replace(vscode.window.spgo.config.workspaceRoot + path.sep, '');
        // let finalNode : string = relativeFilePath.split(path.sep).pop();

        // return finalNode.indexOf('.') >= 0 ? relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep)) : relativeFilePath;
    }

    static getActiveFile(workspaces: vscode.WorkspaceFolder[]): vscode.TextDocument | undefined {
        const activeTextEditor = vscode.window.activeTextEditor;
        let file: vscode.TextDocument | undefined;
        if (activeTextEditor) {
            let workspace = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri);
            if (workspace && workspaces.filter(w => w.name == workspace.name).length) {
                file = activeTextEditor.document;
            }
        }
        return file;
    }
}
