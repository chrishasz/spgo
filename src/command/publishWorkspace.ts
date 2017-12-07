'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function publishWorkspace() : Thenable<any> {
        
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService();
    
    return UiHelper.showStatusBarProgress('Publishing workspace', 
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then((publishingScope) => fileService.uploadWorkspaceToServer(publishingScope))
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
    );
}
