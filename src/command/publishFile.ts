import * as vscode from 'vscode';
import {IError} from './../spgo';
import Constants from './../constants';
import {SpFileGateway} from './../gateway/spFileGateway';
import * as Logger from './../util/logger';
import verifyCredentials from './../service/authenticationservice';

export default function publishFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Promise<any> {

    let documentGateway : SpFileGateway = new SpFileGateway();

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot) 
        && (vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MAJOR || vscode.window.spgo.config.publishingScope === Constants.PUBLISHING_MINOR)){
        
        return verifyCredentials(vscode.window.spgo, textDocument)
            .then(documentGateway.uploadToServer)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));

    }
}