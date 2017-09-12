'use strict';
import * as vscode from 'vscode';
import * as SpFileGateway from './../gateway/spFileGateway';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import {AuthenticationService} from './../service/authenticationservice';


/* tslint:disable:noUnusedParameters */
export default function checkOutFile(textDocument: vscode.TextDocument) : Thenable<any> { //, context: vscode.ExtensionContext) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);

        Logger.outputMessage(`Checking out File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return UiHelper.showStatusBarProgress(`Checking out File:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.checkoutFile)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}