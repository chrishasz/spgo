'use strict';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

export default function discardCheckOut(fileUri: vscode.Uri, config : IConfig) : Thenable<any> {

    // is this a directory?
    // if so, tell the user we are too lazy to implement a recursive version of discard checkout.
    if(fs.lstatSync(fileUri.fsPath).isDirectory()){
        Logger.showWarning('The discard file check-out command only works for single files at this time.')
    }
    // undo the checkout.
    else{
        if( fileUri.fsPath.includes(config.workspaceRoot)){
            let fileName : string = FileHelper.getFileName(fileUri);
            let fileService : SPFileService = new SPFileService(config);
            
            return UiHelper.showStatusBarProgress(`Discarding Check out for:  ${fileName}`,
                AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                    .then((filePath) => fileService.undoFileCheckout(filePath))
                    .then(() => {
                        Logger.outputMessage(`Discard check-out successful for file ${fileUri.fsPath}.`, vscode.window.spgo.outputChannel);
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        }
    }
}