'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function saveFile(fileUri: vscode.Uri) : Thenable<any> { 

    if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(fileUri.path);
        let fileService : SPFileService = new SPFileService();
        
        Logger.outputMessage(`Saving file:  ${fileUri.path}`, vscode.window.spgo.outputChannel);

        return UiHelper.showStatusBarProgress(`Saving file:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
                .then((fileUri) => fileService.uploadFileToServer(fileUri))  
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}