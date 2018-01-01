'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';


export default function publishFile(fileUri: vscode.Uri, publishingScope? : string) : Thenable<any> {

    if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(fileUri.path);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Publishing major file version:  ${fileUri.path}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Publishing major file version:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
                .then((fileUri) => fileService.uploadFileToServer(fileUri, publishingScope))
                .then(function(){
                    Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                })
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}