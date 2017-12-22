'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function compareFileWithServer(localPath : vscode.Uri) : Thenable<any> {

    if( localPath.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(localPath.path);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Starting file compare for:  ${fileName}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Downloading Server version of:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, localPath)
                .then((localPath) => fileService.downloadFileMajorVersion(localPath))
                .then((dlFileUrl) => openFileCompare(localPath, dlFileUrl))
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );

        function openFileCompare(localPath : vscode.Uri, dlFileUrl : string){
            
            Logger.outputMessage(`localPath:  ${localPath} dlFilrUrl: ${dlFileUrl}`, vscode.window.spgo.outputChannel);
        }
    }
}