'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from './../constants';
import { IPublishingAction } from './../spgo';
import { UiHelper } from './../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from './../util/fileHelper';
import { ErrorHelper } from './../util/errorHelper';
import { SPFileService } from './../service/spFileService';
import { AuthenticationService } from './../service/authenticationService';


export default function publishFile(fileUri: vscode.Uri, publishingScope : string) : Thenable<any> {

    if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let publishingInfo : IPublishingAction = null;
        let fileService : SPFileService = new SPFileService();
        let fileName : string = FileHelper.getFileName(fileUri.fsPath);

        //is this a directory?
        if(fs.lstatSync(fileUri.fsPath).isDirectory()){
            publishingInfo = {
                contentUri : fileUri.fsPath + path.sep + UrlHelper.osAwareGlobStar(),
                scope : publishingScope,
                message : vscode.window.spgo.config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
            }
        }
        else{
            publishingInfo = {
                contentUri : fileUri.fsPath,
                scope : publishingScope,
                message : vscode.window.spgo.config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
            }
        }
        
        Logger.outputMessage(`Publishing ${publishingScope} file version:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Publishing ${publishingScope} file version:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, publishingInfo)
                .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
                .then((publishingInfo) => fileService.uploadFileToServer(publishingInfo, publishingScope))
                .then(function(){
                    Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                })
                .catch(err => ErrorHelper.handleError(err))
        );
    }
}