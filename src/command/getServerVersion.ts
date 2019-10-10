'use strict';

import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {UrlHelper} from './../util/urlHelper';
import {FileHelper} from './../util/fileHelper';
import {ErrorHelper} from './../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationService';

export default function getServerVersion(fileUri: vscode.Uri) : Thenable<any> {

    let fileService : SPFileService = new SPFileService();
    let fileName : string = FileHelper.getFileName(fileUri);
    
    Logger.outputMessage(`Getting server version for:  ${fileName}`, vscode.window.spgo.outputChannel);

    return UiHelper.showStatusBarProgress(`Getting server version for:  ${fileName}`,
        AuthenticationService.verifyCredentials(vscode.window.spgo, fileUri)
            .then((fileUri : vscode.Uri) => getServerFiles(fileUri))
            .catch(err => ErrorHelper.handleError(err))
    );

    function getServerFiles(fileUri: vscode.Uri) : Promise<any>{
        if( FileHelper.isPathFile(fileUri)){
            return fileService.downloadFileMajorVersion(fileUri, vscode.window.spgo.config.workspaceRoot)
        }
        else{
            let folderPath : string = FileHelper.getExtensionRelativeFilePath(fileUri);
            folderPath = UrlHelper.normalizeSlashes(folderPath);
            //return fileService.downloadFiles('/siteassets/subfolder/**/*');
            return fileService.downloadFiles(folderPath + '/**/*');//path.sep + '**' + path.sep + '*');
        }
    }
}