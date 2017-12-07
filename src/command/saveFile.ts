'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function saveFile(textDocument: vscode.TextDocument) : Thenable<any> { 

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        let fileService : SPFileService = new SPFileService();
        
        Logger.outputMessage(`Saving file:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return UiHelper.showStatusBarProgress(`Saving file:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then((textDocument) => fileService.uploadFileToServer(textDocument))//() => fileService.uploadFileToServer)//   
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}