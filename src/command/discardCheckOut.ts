'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function discardCheckOut(textDocument: vscode.TextDocument) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Discarding Check out for File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Discarding Check out for:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then((textDocument) => fileService.undoFileCheckout(textDocument))
                .then(() => {
                    Logger.outputMessage(`Discard check-out successful for file ${textDocument.fileName}.`, vscode.window.spgo.outputChannel);
                })
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}