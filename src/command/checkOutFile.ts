import * as vscode from 'vscode';
import * as Logger from './../util/logger';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError} from './../spgo';
import Constants from './../constants';
import * as SpFileGateway from './../gateway/spFileGateway';

export default function checkOutFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Promise<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        
        Logger.outputMessage(`Checking out File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return verifyCredentials(vscode.window.spgo, textDocument)
            .then(SpFileGateway.checkoutFile)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    }
}