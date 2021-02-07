'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { ICommand, IConfig } from '../spgo';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { WorkspaceHelper } from '../util/workspaceHelper';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class RetrieveFolderCommand implements ICommand {

    /**
    *
    * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
    * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
    */
    execute(_fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            return UiHelper.showStatusBarProgress('Downloading files',
                WorkspaceHelper.getActiveWorkspaceUri()
                    .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
                    .then((config : IConfig) => {
                        return AuthenticationService.verifyCredentials(vscode.window.spgo, config)
                            .then(() => this.downloadFiles(config))
                            .then(() => Logger.updateStatusBar('File Download Complete.', 5));
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

    public downloadFiles(config : IConfig) : Thenable<any> {

        Logger.outputMessage('Starting folder download...', vscode.window.spgo.outputChannel);


        let options: vscode.InputBoxOptions = {
            ignoreFocusOut: true,
            placeHolder: '/site/relative/path/to/folder',
            prompt: 'Enter a site relative path to the folder or file you would like to download. WARNING: This will overwrite all local files!!',
        };

        return vscode.window.showInputBox(options).then(result => {

            let fileService : SPFileService = new SPFileService(config);
            let remoteFolderUri : string = config.sharePointSiteUrl + UrlHelper.ensureLeadingWebSlash(result);
            let siteUri : Uri = WorkspaceHelper.getSiteUriForActiveWorkspace(remoteFolderUri, config);

            let remoteFolder = remoteFolderUri.replace(siteUri.toString(), '');
            let localFolder : string = remoteFolder + UrlHelper.removeLeadingSlash(FileHelper.convertToForwardSlash(remoteFolderUri));

            try{

                return fileService.downloadFiles(siteUri, remoteFolder)
                    .then((downloadResults : Array<any>) => {
                        //TODO: format slashes properly in this output Message
                        Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${localFolder}`, vscode.window.spgo.outputChannel);
                    });
            }
            catch(ex){
                ErrorHelper.handleError(ex);
            }

        });
    }
}
