import * as vscode from 'vscode';
import * as path from 'path';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import {IError} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';
import verifyCredentials from './../service/authenticationservice';

export default function populateWorkspace() : Thenable<any> {
        
    Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);

    return showStatusBarProgress('Populating workspace',
        verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
    );

    function downloadFiles() : Thenable<any> {
        
        return new Promise(function (resolve, reject) {
            let downloads : Promise<any>[] = [];

            if(vscode.window.spgo.config.remoteFolders){
                for (let folder of vscode.window.spgo.config.remoteFolders) {
                    downloads.push(SpFileGateway.downloadFiles(folder));
                }
                Promise.all(downloads)
                    .then(function(){
                        Logger.outputMessage(`file synchronization complete.`, vscode.window.spgo.outputChannel);
                        resolve();
                    })
            }
            else{
                let error : IError ={
                    message : '"remoteFolders":[string] property not configured in workspace configuration file.'
                };
                Logger.outputError(error, vscode.window.spgo.outputChannel);
                reject();
            }
        });
    }
}
