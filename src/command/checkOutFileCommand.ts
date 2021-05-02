'use strict';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { ICommand, IConfig } from '../spgo';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class CheckOutFileCommand implements ICommand {

    /**
    * Checks out the currently selected file from SharePoint
    * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
    * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
    */
    execute(fileUri : Uri, _props? : any) : Thenable<any>{

        try{

            let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Checking out file:  ${fileName}`,
                 vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {
                        //is this a directory?
                        if(fs.lstatSync(fileUri.fsPath).isDirectory()){
                            Logger.showWarning('The check-out file command only works for single files at this time.')
                        }
                        else{
                            if( fileUri.fsPath.includes(config.sourceRoot)){
                                let downloadPath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER;
                                let fileService : SPFileService = new SPFileService(config);

                                return AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                                    .then((filePath) => fileService.checkoutFile(filePath))
                                    .then(() => this.downloadFileAndCompare(config, fileUri, downloadPath))
                                    .then(() => Logger.updateStatusBar('File Checkout Complete.', 5));
                            }
                        }
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

    public downloadFileAndCompare(config : IConfig, localPath : Uri, downloadPath : any) : Promise<any>{

        let fileService : SPFileService = new SPFileService(config);

        return fileService.downloadFileMajorVersion(localPath, downloadPath)
            .then((dlFileUrl) => {
                //open files - a bit messy, but necessary for working with async objects
                vscode.workspace.openTextDocument(localPath)
                    .then((doc1) => {
                        let remotePath : vscode.Uri = vscode.Uri.file(dlFileUrl[0].SavedToLocalPath);

                        vscode.workspace.openTextDocument(remotePath)
                            .then((doc2) => {

                                if(doc1.getText() != doc2.getText()){
                                    vscode.window.showInformationMessage('The server version of this file appears to be different from your local version. Open both files in a compare window?', {modal : true}, Constants.OPTIONS_OPEN)
                                        .then(result => {
                                            if( result == Constants.OPTIONS_OPEN){
                                                Logger.outputMessage(`localPath:  ${localPath} dlFileUrl: ${remotePath}`, vscode.window.spgo.outputChannel);
                                                vscode.commands.executeCommand('vscode.diff', remotePath, localPath, '(Server)  <=====>  (Local)');
                                            }
                                        });
                                }
                            });
                    },
                    (err) => {ErrorHelper.handleError(err);});
            })
    }

}
