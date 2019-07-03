'use strict';
import * as path from 'path';
import * as vscode from 'vscode';

export class FileHelper {
    static getFileName(filePath: string): string {
        return filePath.substring(filePath.lastIndexOf(path.sep) + 1);
    }

    static getFolderFromPath(filePath: string): string {
        let relativeFilePath = filePath.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
        return relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
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
