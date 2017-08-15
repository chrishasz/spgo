var sppull = require("sppull").sppull;
import {spsave} from 'spsave';
import * as path from 'path';
import * as vscode from 'vscode';
import * as URL from 'url';
import Constants from './../constants';
import * as Logger from './../util/logger';
import * as UrlFormatter from './../util/urlFormatter';
import {IError} from './../spgo';

export class SpFileGateway{

    public async downloadFiles(remoteFolder){
        let sharePointSiteUrl : URL.Url = URL.parse(vscode.window.spgo.config.sharePointSiteUrl);

        //format the remote folder to /<folder structure>/  
        remoteFolder = UrlFormatter.formatFolder(remoteFolder);
        
        var context = {
            siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
            creds : {
                username: vscode.window.spgo.credential.username,
                password: vscode.window.spgo.credential.password
            }
        };
    
        var options = {
            spBaseFolder : sharePointSiteUrl.pathname,
            spRootFolder: remoteFolder,
            dlRootFolder: vscode.window.spgo.config.workspaceRoot
        };
        
        sppull(context, options)
            .then(function(downloadResults) {
                Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
            })
            .catch(function(err){
                //TODO: this is sorta hacky- Detect if this error was due to credentials
                if(err.message.indexOf('wst:FailedAuthentication') > 0){
                    vscode.window.spgo.credential = null;
                    let error : IError ={
                        message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                    };
                    Logger.outputError(error, vscode.window.spgo.outputChannel);
                }
                //otherwise something else happened.
                else{
                    Logger.outputError(err, vscode.window.spgo.outputChannel);
                }
            });
    }

    public uploadToServer(textDocument: vscode.TextDocument) {
        if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
            let relativeFilePath = textDocument.fileName.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
            let remoteFolder = relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
            let remoteFileName = relativeFilePath.substring(relativeFilePath.lastIndexOf(path.sep)+1);

            var coreOptions = SpFileGateway.buildCoreUploadOptions(vscode.window.spgo.config);//() => this.buildCoreUploadOptions(vscode.window.spgo.config);
            var creds = {
                username: vscode.window.spgo.credential.username,
                password: vscode.window.spgo.credential.password
            };

            var fileOptions = {
                folder: remoteFolder,
                fileName: remoteFileName, //'file.txt',
                fileContent: textDocument.getText()
            };

            spsave(coreOptions, creds, fileOptions)
                .then(function(){
                    Logger.outputMessage(`file ${textDocument.fileName} successfully saved to server.`, vscode.window.spgo.outputChannel);
                })
                .catch(function(err){
                    //TODO: this is sorta hacky- Detect if this error was due to credentials
                    if(err.message.indexOf('wst:FailedAuthentication') > 0){
                        vscode.window.spgo.credential = null;
                        let error : IError ={
                            message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                        };
                        Logger.outputError(error, vscode.window.spgo.outputChannel);
                    }
                    //otherwise something else happened.
                    else{
                        Logger.outputError(err, vscode.window.spgo.outputChannel);
                    }
                });
        }
        else{
            vscode.window.spgo.credential = null;
            let error : IError ={
                message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
            };
            Logger.outputError(error, vscode.window.spgo.outputChannel);
        }
    }

    static buildCoreUploadOptions(config) : any {
        var coreOptions = {
            siteUrl: vscode.window.spgo.config.sharePointSiteUrl,
            checkinMessage : 'Updated by SPGo',
            checkin : false,
            checkinType : 2
        };

        if(config.publishingScope === Constants.PUBLISHING_MAJOR){
            coreOptions.checkin = true;
            coreOptions.checkinType = 1;
        }
        else if(config.publishingScope === Constants.PUBLISHING_MINOR){
            coreOptions.checkin = true;
            coreOptions.checkinType = 0;
        }

        return coreOptions;
    }
}