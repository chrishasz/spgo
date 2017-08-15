import * as vscode from 'vscode';
import * as URL from 'url';
var sppull = require("sppull").sppull;
import {IError} from './../spgo';
import Constants from './../constants';
import {SpFileGateway} from './../gateway/spFileGateway';
import * as path from 'path';
import * as logger from './../util/logger';
import verifyCredentials from './../service/authenticationservice';
import * as UrlFormatter from './../util/urlFormatter';

export default function retrieveFolder() : Promise<any> {

    return verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => logger.outputError(err, vscode.window.spgo.outputChannel));

    function downloadFiles() {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
            let sharePointSiteUrl : URL.Url = URL.parse(vscode.window.spgo.config.sharePointSiteUrl);
            let documentGateway : SpFileGateway = new SpFileGateway();

            let options: vscode.InputBoxOptions = {
                ignoreFocusOut: true,
                placeHolder: '/site/relative/path/to/folder',
                prompt: 'Enter a site relative path to the folder or file you would like to download. WARNING: This will overwrite all local files!!',
            };
            vscode.window.showInputBox(options).then(result => {
                documentGateway.downloadFiles(result);
            });
        }
        else{
            vscode.window.spgo.credential = null;
            let error : IError ={
                message : 'Invalid user credentials. Please try again or reset your credentials via the command menu.' 
            };
            logger.outputError(error, vscode.window.spgo.outputChannel);
        }
    }
}
