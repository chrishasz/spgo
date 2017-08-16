import * as vscode from 'vscode';
import {IError} from './../spgo';
import Constants from './../constants';
import * as SpFileGateway from './../gateway/spFileGateway';
import * as Logger from './../util/logger';
import verifyCredentials from './../service/authenticationservice';

import Uri from 'vscode-uri'

export default function publishFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Promise<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        
        Logger.outputMessage(`Publishing File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return verifyCredentials(vscode.window.spgo, textDocument)
            .then(SpFileGateway.publishFile)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    }
}