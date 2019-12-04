'use strict';
import * as vscode from 'vscode';

import {FileHelper} from '../util/fileHelper'
import { Uri, WorkspaceFolder } from 'vscode';

export class WorkspaceHelper{

    // Get the URI of the currently active VSCode workspace
    //TODO: Convert this into a promise, and select active workspaces from a dropdown.
    static getActiveWorkspaceUri() : Promise<Uri> {
        return new Promise((resolve, reject) => {
            let selectedResource : Uri = vscode.window.activeTextEditor.document ? vscode.window.activeTextEditor.document.uri : Uri.parse('');
            let activeResource : WorkspaceFolder = vscode.workspace.getWorkspaceFolder(selectedResource);
            let activeWorkspace : Uri = null;

            if( activeResource ){
                activeWorkspace = activeResource.uri;
            }
            else if(vscode.workspace.workspaceFolders.length === 1){
                //No folders or anything, initializing for the first time.
                activeWorkspace = vscode.workspace.workspaceFolders[0].uri;
            }
            else if(vscode.workspace.workspaceFolders.length > 1){
                //Multiple folders in the workspace. Show a QuickPick
                let options: vscode.QuickPickOptions = {
                    canPickMany: false,
                    ignoreFocusOut: true
				};
                return vscode.window.showQuickPick(vscode.workspace.workspaceFolders.map((folder : WorkspaceFolder) => {return folder.uri.fsPath}), options)
                    .then((result: string) => {
                        if(!result){
                            reject("No workspace selected.")
                        }
                        activeWorkspace = FileHelper.convertToUri(result);
                        resolve(activeWorkspace);
                    });
            }
            
            resolve(activeWorkspace);
        });
    }
}