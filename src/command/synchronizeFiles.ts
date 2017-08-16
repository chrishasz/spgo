import * as vscode from 'vscode';
import * as path from 'path';
import * as Logger from './../util/logger';
import * as UrlFormatter from './../util/urlFormatter';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError} from './../spgo';
import Constants from './../constants';

var sppull = require("sppull").sppull;

export default function synchronizeFiles() : Promise<any> {
    if( (vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MAJOR || vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MINOR)){
        
        Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);

        return verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
    }

    function downloadFiles() {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){

            if(vscode.window.spgo.config.remoteFolders){
                for (let folder of vscode.window.spgo.config.remoteFolders) {
                    SpFileGateway.downloadFiles(folder);
                }
            }
            else{
                let error : IError ={
                    message : '"remoteFolder":[string] property not configured in workspace configuration file.'
                };
                Logger.outputError(error, vscode.window.spgo.outputChannel);
            }
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
