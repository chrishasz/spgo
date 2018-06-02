'use strict';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from './../util/uiHelper';
import { FileHelper } from './../util/fileHelper';
import { ErrorHelper } from './../util/errorHelper';
import { SPFileService } from './../service/spFileService';
import { AuthenticationService } from './../service/authenticationService';


export default function deleteFile(fileUri: vscode.Uri) : Thenable<any> {

    if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(fileUri.path);
        let fileService : SPFileService = new SPFileService();

        Logger.outputMessage(`Deleting file  ${fileUri.path} from server.`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Deleting ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
                .then((fileUri) => {
                    return vscode.window.showWarningMessage(`Are you sure you want to delete ${fileName} from the server?`, Constants.OPTIONS_YES, Constants.OPTIONS_NO)
                        .then(result => {
                            if( result == Constants.OPTIONS_YES){
                                return fileService.deleteFileFromServer(fileUri)
                                    .then(() => {
                                        Logger.outputMessage('Remote file delete complete.', vscode.window.spgo.outputChannel);
                                    })
                                    .then(() =>{
                                        fs.remove(fileUri.fsPath)
                                            .then(() => {
                                                Logger.outputMessage('Local file delete complete.', vscode.window.spgo.outputChannel);
                                            });
                                    });
                            }
                            else{
                                Logger.outputMessage('Delete operation cancelled.', vscode.window.spgo.outputChannel);
                            }
                        })
                    })
                .catch(err => ErrorHelper.handleError(err))
        );
    }
}