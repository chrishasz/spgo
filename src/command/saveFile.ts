import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as FileHelper from './../util/fileHelper';
import * as SpFileGateway from './../gateway/spFileGateway';

import Uri from 'vscode-uri'
import {IError} from './../spgo';
import Constants from './../constants';
import {showStatusBarProgress} from './../util/uiHelper';
import verifyCredentials from './../service/authenticationservice';

export default function saveFile(textDocument: vscode.TextDocument, context: vscode.ExtensionContext) : Thenable<any> {

    if( textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(textDocument.fileName);
        
        Logger.outputMessage(`Saving file:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);

        return showStatusBarProgress(`Saving file:  ${fileName}`,
            verifyCredentials(vscode.window.spgo, textDocument)
                .then(SpFileGateway.uploadFileToServer)
                .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
        );
    }
}