'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function retrieveFolder() : Thenable<any> {
    Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService();

    return UiHelper.showStatusBarProgress('Downloading files',
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
    );

    function downloadFiles() : Thenable<any> {
        
        return new Promise(function (resolve, reject) {
            let options: vscode.InputBoxOptions = {
                ignoreFocusOut: true,
                placeHolder: '/site/relative/path/to/folder',
                prompt: 'Enter a site relative path to the folder or file you would like to download. WARNING: This will overwrite all local files!!',
            };
            vscode.window.showInputBox(options).then(result => {
                fileService.downloadFiles(result)
                    .then(function() {
                        resolve();
                    }).catch(err => {
                        Logger.outputError(err);
                        reject();
                    });
            });
        });
    }
}
