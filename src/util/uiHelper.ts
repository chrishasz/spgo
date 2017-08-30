import * as vscode from 'vscode';

export function showStatusBarProgress(message : string, action : Promise<any>) : Thenable<any>{

    let options : vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Window, 
        title: message
    }

    return vscode.window.withProgress(options, 
        p => {
            return new Promise((resolve, reject) => {
                action.then(function(){
                    resolve();
                })
            });
        }
    );
}