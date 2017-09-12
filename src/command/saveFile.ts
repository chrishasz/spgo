'use strict';
import * as vscode from 'vscode';
import * as SpFileGateway from './../gateway/spFileGateway';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {AuthenticationService} from './../service/authenticationservice';

export default function saveFile(textDocument: vscode.TextDocument) : Thenable<any> { 

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        
        Logger.outputMessage(`Saving file:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return UiHelper.showStatusBarProgress(`Saving file:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.uploadFileToServer)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}