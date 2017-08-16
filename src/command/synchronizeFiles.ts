import * as vscode from 'vscode';
import * as path from 'path';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError} from './../spgo';
import Constants from './../constants';

var sppull = require("sppull").sppull;

export default function synchronizeFiles() : Promise<any> {
        
    Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);

    return verifyCredentials(vscode.window.spgo)
        .then(downloadFiles)
        .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    
    function downloadFiles() {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
            
            let downloads : Promise<any>[] = [];//new Promise<any>[]();

            if(vscode.window.spgo.config.remoteFolders){
                for (let folder of vscode.window.spgo.config.remoteFolders) {
                    downloads.push(SpFileGateway.downloadFiles(folder));
                }
                Promise.all(downloads)
                    .then(function(){
                        Logger.outputMessage(`file synchronization complete.`, vscode.window.spgo.outputChannel);
                    })
                    .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
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
