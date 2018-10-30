'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationService';

export default function retrieveFolder() : Thenable<any> {
    let fileService : SPFileService = new SPFileService();

    return UiHelper.showStatusBarProgress('Downloading files',
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => ErrorHelper.handleError(err))
    );

    function downloadFiles() : Thenable<any> {
        
        Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);
        
        return new Promise((resolve, reject) => {
            let options: vscode.InputBoxOptions = {
                ignoreFocusOut: true,
                placeHolder: '/site/relative/path/to/folder',
                prompt: 'Enter a site relative path to the folder or file you would like to download. WARNING: This will overwrite all local files!!',
            };
            vscode.window.showInputBox(options).then(result => {
                fileService.downloadFiles(result)
                    .then(() => {
                        Logger.outputMessage(`Retrieve folder success.`);
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
            });
        });
    }
}
