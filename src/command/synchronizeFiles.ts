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

export default function synchronizeFiles() : Promise<any> {
    if( (vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MAJOR || vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MINOR)){
        return verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => logger.outputError(err, vscode.window.spgo.outputChannel));
    }

    function downloadFiles() {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
            let documentGateway : SpFileGateway = new SpFileGateway();

            if(vscode.window.spgo.config.remoteFolders){
                for (let folder of vscode.window.spgo.config.remoteFolders) {
                    documentGateway.downloadFiles(folder);
                }
            }
            else{
                let error : IError ={
                    message : '"remoteFolder":[string] property not configured in workspace configuration file.'
                };
                logger.outputError(error, vscode.window.spgo.outputChannel);
            }
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
