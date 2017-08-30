import * as vscode from 'vscode';
import * as path from 'path';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import {IError} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';
import verifyCredentials from './../service/authenticationservice';

export default function retrieveFolder() : Thenable<any> {
    Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);

    return showStatusBarProgress('Downloading files',
        verifyCredentials(vscode.window.spgo)
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
                    })
            });
        });
    }
}
