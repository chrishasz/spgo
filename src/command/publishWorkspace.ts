'use strict';
import * as vscode from 'vscode';
import * as SpFileGateway from './../gateway/spFileGateway';

import {Logger} from '../util/logger';
import {UiHelper} from './../util/uiHelper';
import {AuthenticationService} from './../service/authenticationservice';

export default function publishWorkspace() : Thenable<any> {
        
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    
    return UiHelper.showStatusBarProgress('Publishing workspace', 
        AuthenticationService.verifyCredentials(vscode.window.spgo)
            .then(SpFileGateway.uploadWorkspaceToServer)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
    );
}
