'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {ISPFileInformation} from './../spgo';
import {UiHelper} from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationService';

export default function saveFile(textDocument: vscode.TextDocument) : Thenable<any> { 

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        Logger.outputMessage(`Getting file information for:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        let fileService : SPFileService = new SPFileService();

        return UiHelper.showStatusBarProgress('',
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then((textDocument) => fileService.getFileInformation(textDocument))
                .then((fileInfo) => showFileInformation(fileInfo))
                .catch(err => ErrorHelper.handleError(err))
        );
    }

    function showFileInformation(fileInfo : ISPFileInformation) : void{

        Logger.outputMessage(fileInfo.checkOutBy ? 'Check out Type: ' + fileInfo.checkOutType + " by user: " + fileInfo.checkOutBy : 'Check out Type: ' + fileInfo.checkOutType);
        
        if( fileInfo.checkOutType == 0){
            let message : string = `File Checked out to user: ${fileInfo.checkOutBy}`;
            Logger.outputWarning(message);
            Logger.updateStatusBar(message, 5);
        }
        else{
            Logger.updateStatusBar(`File is not checked out.`, 5);
        }
    }
}