'use strict';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';


export default function deleteFile(fileUri: vscode.Uri, config : IConfig) : Thenable<any> {

    //is this a directory?
    if(fs.lstatSync(fileUri.fsPath).isDirectory()){
        Logger.showWarning('The delete file command only works for single files at this time.')
    }
    else{
        if( fileUri.fsPath.includes(config.sourceRoot)){
            let fileName : string = FileHelper.getFileName(fileUri);
            let fileService : SPFileService = new SPFileService(config);
            
            return UiHelper.showStatusBarProgress(`Deleting ${fileName}`,
                AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                    .then((fileUri) => {
                        Logger.outputMessage(`Deleting file  ${fileUri.fsPath} from server.`, vscode.window.spgo.outputChannel);

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
                                                    Logger.updateStatusBar('File Deletion Complete.', 5);
                                                });
                                        });
                                }
                                else{
                                    Logger.outputMessage('Delete operation cancelled.', vscode.window.spgo.outputChannel);
                                    Logger.updateStatusBar('File Delete Cancelled.', 5);
                                }
                            })
                        })
                    .catch(err => ErrorHelper.handleError(err))
            );
        }
    }
}