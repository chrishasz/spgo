import * as vscode from 'vscode';
import {IError} from './../spgo';
import Constants from './../constants';
import * as SpFileGateway from './../gateway/spFileGateway';
import * as Logger from './../util/logger';
import verifyCredentials from './../service/authenticationservice';

import Uri from 'vscode-uri'

export default function publishFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext, publishingScope? : string) : Promise<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        
        //ToDo: This is hacky - need .
        if( publishingScope === Constants.PUBLISHING_MAJOR){
            Logger.outputMessage(`Publishing Major file version:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
            return verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.publishMajorFileVersion)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
        }
        else if( publishingScope === Constants.PUBLISHING_MINOR){
            Logger.outputMessage(`Publishing minor file version:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
            return verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.publishMinorFileVersion)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
        }
    }
}