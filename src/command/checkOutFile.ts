'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';


/* tslint:disable:noUnusedParameters */
export default function checkOutFile(textDocument: vscode.TextDocument) : Thenable<any> { //, context: vscode.ExtensionContext) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Checking out File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return UiHelper.showStatusBarProgress(`Checking out File:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then(fileService.checkoutFile)
                .then(() => {
                    Logger.outputMessage(`file ${textDocument.fileName} successfully checked out from server.`, vscode.window.spgo.outputChannel);
                })
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}