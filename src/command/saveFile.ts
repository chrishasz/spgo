import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import {IError} from './../spgo';
import Constants from './../constants';
import verifyCredentials from './../service/authenticationservice';

export default function saveFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Promise<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        
        Logger.outputMessage(`Saving File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return verifyCredentials(vscode.window.spgo, textDocument)
            .then(SpFileGateway.uploadToServer)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    }
}