'use strict';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

export default function compareFileWithServer(localPath : vscode.Uri, config : IConfig) : Thenable<any> {
    //is this a directory?
    if(fs.lstatSync(localPath.fsPath).isDirectory()){
        Logger.showWarning('The compare file with server command only works for single files at this time.')
    }
    else{
        if( localPath.fsPath.includes(config.workspaceRoot)){
            let fileName : string = FileHelper.getFileName(localPath);
            let fileService : SPFileService = new SPFileService(config);
            let downloadPath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER;

            Logger.outputMessage(`Starting file compare for:  ${fileName}`, vscode.window.spgo.outputChannel);
            
            return UiHelper.showStatusBarProgress(`Downloading Server version of:  ${fileName}`,
                AuthenticationService.verifyCredentials(vscode.window.spgo, config, localPath)
                    .then((localPath) => fileService.downloadFileMajorVersion(localPath, downloadPath))
                    .then((dlFileUrl) => openFileCompare(localPath, dlFileUrl))
                    .catch(err => ErrorHelper.handleError(err))
            );

            function openFileCompare(localPath : vscode.Uri, dlFileUrl : any){            
                if( dlFileUrl && dlFileUrl.length > 0){
                    let remotePath : vscode.Uri = vscode.Uri.parse('file:///' + UrlHelper.removeLeadingSlash(dlFileUrl[0].SavedToLocalPath));
                    Logger.outputMessage(`localPath:  ${localPath} dlFileUrl: ${remotePath}`, vscode.window.spgo.outputChannel);

                    vscode.commands.executeCommand('vscode.diff', remotePath, localPath, '(Server)  <=====>  (Local)');
                }
                else{
                    Logger.outputMessage('Could not download file for compare');
                }
            }
        }
    }
}