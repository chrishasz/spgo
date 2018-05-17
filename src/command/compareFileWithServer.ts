'use strict';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {Constants} from './../constants';
import {UiHelper} from './../util/uiHelper';
import {FileHelper} from './../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationService';

export default function compareFileWithServer(localPath : vscode.Uri) : Thenable<any> {

    if( localPath.fsPath.includes(vscode.window.spgo.config.workspaceRoot)){
        let fileName : string = FileHelper.getFileName(localPath.path);
        let fileService : SPFileService = new SPFileService();
        let downloadPath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER;

        Logger.outputMessage(`Starting file compare for:  ${fileName}`, vscode.window.spgo.outputChannel);
        
        return UiHelper.showStatusBarProgress(`Downloading Server version of:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, localPath)
                .then((localPath) => fileService.downloadFileMajorVersion(localPath, downloadPath))
                .then((dlFileUrl) => openFileCompare(localPath, dlFileUrl))
                .catch(err => ErrorHelper.handleError(err))
        );

        function openFileCompare(localPath : vscode.Uri, dlFileUrl : any){            
            let remotePath : vscode.Uri = vscode.Uri.parse('file://' + dlFileUrl[0].SavedToLocalPath);
            Logger.outputMessage(`localPath:  ${localPath} dlFilrUrl: ${remotePath}`, vscode.window.spgo.outputChannel);

            vscode.commands.executeCommand('vscode.diff', remotePath, localPath, '(Server)  <=====>  (Local)');
        }
    }
}