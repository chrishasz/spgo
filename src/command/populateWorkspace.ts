'use strict';
import * as vscode from 'vscode';

import {IError} from './../spgo';
import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationService';

export default function populateWorkspace() : Thenable<any> {
        
    Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService();

    return UiHelper.showStatusBarProgress('Populating workspace',
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => ErrorHelper.handleError(err))
    );

    function downloadFiles() : Thenable<any> {
        
        return new Promise((resolve, reject) => {
            let downloads : Promise<any>[] = [];

            if(vscode.window.spgo.config.remoteFolders){
                for (let folder of vscode.window.spgo.config.remoteFolders) {
                    downloads.push(fileService.downloadFiles(folder));
                }
                Promise.all(downloads)
                    .then(() => {
                        Logger.outputMessage(`file synchronization complete.`, vscode.window.spgo.outputChannel);
                        resolve();
                    })
            }
            else{
                let error : IError ={
                    message : '"remoteFolders":[string] property not configured in workspace configuration file.'
                };
                Logger.showError(error.message, error);
                reject();
            }
        });
    }
}
