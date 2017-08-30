import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as FileHelper from './../util/fileHelper';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import {IError} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';
import verifyCredentials from './../service/authenticationservice';


export default function publishFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext, publishingScope? : string) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        
        //ToDo: This is hacky - clean this up.
        if( publishingScope === Constants.PUBLISHING_MAJOR){
            Logger.outputMessage(`Publishing major file version:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
         
            return showStatusBarProgress(`Publishing major file version:  ${fileName}`,
                verifyCredentials(vscode.window.spgo, textDocument)
                    .then(SpFileGateway.publishMajorFileVersion)
                    .then(function(){
                        Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                    })
                    .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
            );
        }
        else if( publishingScope === Constants.PUBLISHING_MINOR){
            Logger.outputMessage(`Publishing minor file version:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

            return showStatusBarProgress(`Publishing minor file version:  ${fileName}`,
                verifyCredentials(vscode.window.spgo, textDocument)
                    .then(SpFileGateway.publishMinorFileVersion)
                    .then(function(){
                        Logger.outputMessage('File publish complete.', vscode.window.spgo.outputChannel);
                    })
                    .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
            );
        }
    }
}


//✔