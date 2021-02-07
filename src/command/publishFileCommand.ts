'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { IPublishingAction, IConfig, ICommand } from '../spgo';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class PublishFileCommand implements ICommand {

    /**
    * Checks out the currently selected file from SharePoint
    * @param {vscode.Uri} fileUri - Optional filepath (Uses current editor if not given)
    * @param {boolean?} props - Optional properties for this command
    */
    execute(fileUri : Uri, props? : any) : Thenable<any>{

        try{

            let publishingScope : string = props;
            let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Publishing ${publishingScope} file version:  ${fileName}`,
                 vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {
                        if( fileUri.fsPath.includes(config.sourceRoot)){
                            let publishingInfo : IPublishingAction = null;
                            let fileService : SPFileService = new SPFileService(config);

                            //is this a directory?
                            if(fs.lstatSync(fileUri.fsPath).isDirectory()){
                                publishingInfo = {
                                    contentUri : fileUri.fsPath + path.sep + UrlHelper.osAwareGlobStar(),
                                    scope : publishingScope,
                                    message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
                                }
                            }
                            else{
                                publishingInfo = {
                                    contentUri : fileUri.fsPath,
                                    scope : publishingScope,
                                    message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
                                }
                            }

                            Logger.outputMessage(`Publishing ${publishingScope} file version:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

                            return AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishingInfo)
                                .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
                                .then((publishingInfo) => fileService.uploadFilesToServer(publishingInfo))
                                .then(() => {
                                    Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                                    Logger.updateStatusBar('File Download Complete.', 5)
                                });
                        }
                })
                .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }
}
