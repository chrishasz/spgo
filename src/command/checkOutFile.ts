'use strict';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';


import { Logger } from '../util/logger';
import { Constants } from './../constants';
import { UiHelper } from './../util/uiHelper';
import { FileHelper } from './../util/fileHelper';
import { SPFileService } from './../service/spFileService';
import { AuthenticationService } from './../service/authenticationService';
import { ErrorHelper } from '../util/errorHelper';

export default function checkOutFile(fileUri: vscode.Uri) : Thenable<any> {

    //is this a directory?
    if(fs.lstatSync(fileUri.fsPath).isDirectory()){
        Logger.showWarning('The check-out file command only works for single files at this time.')
    }
    else{
        if( fileUri.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
            let downloadPath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER;
            let fileName : string = FileHelper.getFileName(fileUri.fsPath);
            let fileService : SPFileService = new SPFileService();

            Logger.outputMessage(`Checking out File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

            return UiHelper.showStatusBarProgress(`Checking out File:  ${fileName}`,
                AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
                    .then((filePath) => fileService.checkoutFile(filePath))
                    .then(() => downloadFileAndCompare(fileUri, downloadPath))
                    .catch(err => ErrorHelper.handleError(err))
            );
            
            function downloadFileAndCompare(localPath : vscode.Uri, downloadPath : any){

                fileService.downloadFileMajorVersion(localPath, downloadPath)
                    .then((dlFileUrl) => {
                        //open files - a bit messy, but necessary for working with async objects
                        vscode.workspace.openTextDocument(localPath)
                            .then((doc1) => {
                                let remotePath : vscode.Uri = vscode.Uri.parse('file:///' + dlFileUrl[0].SavedToLocalPath);
                                
                                vscode.workspace.openTextDocument(remotePath)
                                    .then((doc2) => {
                                        if(doc1.getText() != doc2.getText()){
                                            vscode.window.showInformationMessage('The server version of this file appears to be different from your local version. Open both files in a compare window?', Constants.OPTIONS_OPEN)
                                                .then(result => {
                                                    if( result == Constants.OPTIONS_OPEN){
                                                        Logger.outputMessage(`localPath:  ${localPath} dlFilrUrl: ${remotePath}`, vscode.window.spgo.outputChannel);
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
    }
}