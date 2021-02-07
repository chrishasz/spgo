'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { ErrorHelper } from '../util/errorHelper';
import { IError, IConfig, ICommand } from '../spgo';
import { SPFileService } from '../service/spFileService';
import { WorkspaceHelper } from '../util/workspaceHelper';
import { AuthenticationService } from '../service/authenticationService';



/*
*
*/
export class PopulateWorkspaceCommand implements ICommand {

    /**
    *
    * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
    * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
    */
    execute(_fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            return UiHelper.showStatusBarProgress('Populating Workspace',
                WorkspaceHelper.getActiveWorkspaceUri()
                    .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
                    .then((config : IConfig) => {
                        return AuthenticationService.verifyCredentials(vscode.window.spgo, config)
                            .then(() => (this.downloadFiles(config))
                            .then(() => Logger.updateStatusBar('File Download Complete.', 5))
                        );
                    })
                    .catch(err => ErrorHelper.handleError(err))
                );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

    public downloadFiles(config : IConfig) : Promise<any> {

        return new Promise((resolve, reject) => {

            let fileService : SPFileService = new SPFileService(config);
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
                        resolve(`file synchronization complete.`);
                    })
            }
            else{
                let error : IError ={
                    message : '"remoteFolders":[string] property not configured in workspace configuration file.'
                };
                Logger.showError(error.message, error);
                reject(error);
            }
        });
    }
}
