'use strict';
import * as vscode from 'vscode';

export class UiHelper{
    static showStatusBarProgress(message : string, action : Promise<any>) : Thenable<any>{
        
        let options : vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Window, 
            title: message
        }
    
        //p.report({message: 'Start working...' });
        return vscode.window.withProgress(options, 
            () => {//p => {
                return new Promise((resolve, reject) => {
                    action.then(function(){
                        resolve();
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            }
        );
    }
}