'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { IPublishingAction, IConfig } from '../spgo';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';


export default function publishFile(fileUri: vscode.Uri, publishingScope : string, config : IConfig) : Thenable<any> {

    if( fileUri.fsPath.includes(config.workspaceRoot)){
        let publishingInfo : IPublishingAction = null;
        let fileService : SPFileService = new SPFileService(config);
        let fileName : string = FileHelper.getFileName(fileUri);

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
        
        return UiHelper.showStatusBarProgress(`Publishing ${publishingScope} file version:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishingInfo)
                .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
                .then((publishingInfo) => fileService.uploadFilesToServer(publishingInfo))
                .then(() => {
                    Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                })
                .catch(err => ErrorHelper.handleError(err))
        );
    }
}