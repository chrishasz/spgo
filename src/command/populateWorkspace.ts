'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { IError, IConfig } from '../spgo';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

export default function populateWorkspace(config : IConfig) : Thenable<any> {
    let fileService : SPFileService = new SPFileService(config);

    return UiHelper.showStatusBarProgress('Populating workspace',
        AuthenticationService.verifyCredentials(vscode.window.spgo, config)
            .then(downloadFiles)
            .catch(err => ErrorHelper.handleError(err))
    );

    function downloadFiles() : Thenable<any> {
        
        return new Promise((resolve, reject) => {

            Logger.outputMessage('Starting File Synchronization...', vscode.window.spgo.outputChannel);

            //TODO: refactor to support subsites with remoteFolders property even if no remoteFolders property exists on the parent site
            if(config.remoteFolders){
                // add all files from the Root Site to the downloads collection
                let downloads : Promise<any>[] = [];

                for (let path of config.remoteFolders) {
                    if(UrlHelper.isFile(path)){
                        downloads.push(fileService.downloadFileMajorVersion(Uri.file(config.sourceRoot + UrlHelper.normalizeSlashes(path)), config.sourceRoot));
                    }
                    else{
                        downloads.push(fileService.downloadFiles(Uri.parse(config.sharePointSiteUrl), decodeURI(path)));
                    }
                }

                if(config.subSites && config.subSites.length > 0){
                    // add all files from the specified SubSites to the downloads collection                    
                    for (let subSite of config.subSites){                    
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
