'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {IFileInformation} from './../spgo';
import {UiHelper} from './../util/uiHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function saveFile(textDocument: vscode.TextDocument) : Thenable<any> { 

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){

        Logger.outputMessage(`Getting file information for:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        let fileService : SPFileService = new SPFileService();

        return UiHelper.showStatusBarProgress('',
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then(() => fileService.getFileInformation)
                .then( fileInfo => showFileInformation(fileInfo))
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }

    function showFileInformation(fileInfo : IFileInformation) : void{
        
        Logger.outputMessage(fileInfo.checkOutBy ? 'Check out Type: ' + fileInfo.checkOutType + " by user: " + fileInfo.checkOutBy : 'Check out Type: ' + fileInfo.checkOutType);

        if( fileInfo.checkOutType == 0){
            Logger.updateStatusBar(`File Checked out to user: ${fileInfo.checkOutBy}`, 5);
        }
        else{
            Logger.updateStatusBar(`File is not checked out.`, 5);
        }
    }
}