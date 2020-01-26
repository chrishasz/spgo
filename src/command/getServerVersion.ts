'use strict';

import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';
import { WorkspaceHelper } from '../util/workspaceHelper';

export default function getServerVersion(fileUri: Uri, config : IConfig) : Thenable<any> {

    let fileService : SPFileService = new SPFileService(config);
    let fileName : string = FileHelper.getFileName(fileUri);
    
    Logger.outputMessage(`Getting server version for:  ${fileName}`, vscode.window.spgo.outputChannel);

    return UiHelper.showStatusBarProgress(`Getting server version for:  ${fileName}`,
        AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
            .then((fileUri : Uri) => getServerFiles(fileUri))
            .catch(err => ErrorHelper.handleError(err))
    );

    function getServerFiles(fileUri: Uri) : Promise<any>{

        let sharePointFileUri : Uri = UrlHelper.getServerRelativeFileUri(fileUri.fsPath, config);
        let siteUri : Uri = WorkspaceHelper.getSiteUriForActiveWorkspace(sharePointFileUri.toString(), config);
        if( FileHelper.isPathFile(fileUri)){
            // Get a single file
            return fileService.downloadFileMajorVersion(fileUri, config.sourceRoot)
        }
        else{
            // User wants to download a full folder.
            let folderPath : string = sharePointFileUri.toString().replace(siteUri.toString(), '');
            folderPath = UrlHelper.normalizeSlashes(folderPath);
            
            return fileService.downloadFiles(siteUri, folderPath + '/**/*');
        }
    }
}