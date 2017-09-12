'use strict';
import * as vscode from 'vscode';
import * as SpFileGateway from './../gateway/spFileGateway';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {AuthenticationService} from './../service/authenticationservice';

export default function retrieveFolder() : Thenable<any> {
    Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);

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
                SpFileGateway.downloadFiles(result)
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
