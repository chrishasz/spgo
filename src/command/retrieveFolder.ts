import * as vscode from 'vscode';
import * as path from 'path';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError} from './../spgo';
import Constants from './../constants';

var sppull = require("sppull").sppull;

export default function retrieveFolder() : Promise<any> {

    Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);

    return verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    function downloadFiles() {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){

            let options: vscode.InputBoxOptions = {
                ignoreFocusOut: true,
                placeHolder: '/site/relative/path/to/folder',
                prompt: 'Enter a site relative path to the folder or file you would like to download. WARNING: This will overwrite all local files!!',
            };
            vscode.window.showInputBox(options).then(result => {
                SpFileGateway.downloadFiles(result)
            });
        }
        else{
            vscode.window.spgo.credential = null;
            let error : IError ={
                message : 'Invalid user credentials. Please try again or reset your credentials via the command menu.' 
            };
            Logger.outputError(error, vscode.window.spgo.outputChannel);
        }
    }
}
