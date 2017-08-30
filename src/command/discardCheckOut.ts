import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as FileHelper from './../util/fileHelper';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import verifyCredentials from './../service/authenticationservice';
import {IError, ICommand} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';

export default function discardCheckOut(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);

        Logger.outputMessage(`Discarding Check out for File:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        
        return showStatusBarProgress(`Discarding Check out for:  ${fileName}`,
            verifyCredentials(vscode.window.spgo, textDocument)
                //.then((doc) => SpFileGateway.undoFileCheckout)
                .then(SpFileGateway.undoFileCheckout)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}