import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as FileHelper from './../util/fileHelper';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError, ICommand} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';

export default function checkOutFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);

        Logger.outputMessage(`Checking out File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return showStatusBarProgress(`Checking out File:  ${fileName}`,
            verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.checkoutFile)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}