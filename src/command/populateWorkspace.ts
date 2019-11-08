'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { IError, IConfig } from './../spgo';
import { Logger } from '../util/logger';
import { UiHelper } from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from './../service/spFileService';
import { AuthenticationService } from './../service/authenticationService';

export default function populateWorkspace() : Thenable<any> {
    let fileService : SPFileService = new SPFileService();

    return UiHelper.showStatusBarProgress('Populating workspace',
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then(downloadFiles)
            .catch(err => ErrorHelper.handleError(err))
    );

    function downloadFiles() : Thenable<any> {
        
        return new Promise((resolve, reject) => {       
            let config : IConfig = vscode.window.spgo.config;

            Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);

            if(config.remoteFolders){
                // add all files from the Root Site to the downloads collection
                let downloads : Promise<any>[] = [];

                for (let folder of config.remoteFolders) {
                    downloads.push(fileService.downloadFiles(Uri.parse(config.sharePointSiteUrl), decodeURI(folder)));
                }

                if(vscode.window.spgo.config.subSites && vscode.window.spgo.config.subSites.length > 0){
                    // add all files from the specified SubSites to the downloads collection
                    
                    for (let subSite of vscode.window.spgo.config.subSites){                    
                        for (let folder of subSite.remoteFolders) {
                            downloads.push(fileService.downloadFiles(Uri.parse(subSite.sharePointSiteUrl), decodeURI(folder)));
                        }
                    }
                }

                //Download the files
                Promise.all(downloads)
                    .then(() => {
                        Logger.outputMessage(`file synchronization complete.`, vscode.window.spgo.outputChannel);
                        resolve();
                    })
            }
            else{
                let error : IError ={
                    message : '"remoteFolders":[string] property not configured in workspace configuration file.'
                };
                Logger.showError(error.message, error);
                reject();
            }
        });
    }
}
