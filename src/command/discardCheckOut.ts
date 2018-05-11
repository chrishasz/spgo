'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function discardCheckOut(fileUri: vscode.Uri) : Thenable<any> {

    if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(fileUri.path);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Discarding Check out for File:  ${fileUri.path}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Discarding Check out for:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
                .then((filePath) => fileService.undoFileCheckout(filePath))
                .then(() => {
                    Logger.outputMessage(`Discard check-out successful for file ${fileUri.path}.`, vscode.window.spgo.outputChannel);
                })
                .catch(err => ErrorHelper.handleError(err))
        );
    }
}