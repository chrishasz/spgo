'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from '../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import {ISPFileInformation, IConfig} from '../spgo';
import {SPFileService} from '../service/spFileService';
import {AuthenticationService} from '../service/authenticationService';

export default function saveFile(textDocument: vscode.TextDocument, config : IConfig) : Thenable<any> { 

    if( textDocument.fileName.includes(config.workspaceRoot)){
        let fileService : SPFileService = new SPFileService(config);

        return UiHelper.showStatusBarProgress('',
            AuthenticationService.verifyCredentials(vscode.window.spgo, config, textDocument)
                .then((textDocument) => fileService.getFileInformation(textDocument))
                .then((fileInfo) => showFileInformation(fileInfo))
                .catch(err => ErrorHelper.handleError(err, true))
        );
    }

    function showFileInformation(fileInfo : ISPFileInformation) : void{

        Logger.outputMessage(fileInfo.checkOutBy ? 'Check out Type: ' + fileInfo.checkOutType + ' by user: ' + fileInfo.checkOutBy : 'Check out Type: ' + fileInfo.checkOutType);
        
        if( fileInfo.checkOutType == 0){
            let message : string = `File Checked out to user: ${fileInfo.checkOutBy}`;
            Logger.outputWarning(message);
            Logger.updateStatusBar(message, 5);
        }
        else{
            Logger.updateStatusBar(`File is not checked out.`, 5);
        }
    }
}