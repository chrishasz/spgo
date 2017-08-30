import * as vscode from 'vscode';
import * as Logger from './../util/logger';
import * as SpFileGateway from './../gateway/spFileGateway';

import {showStatusBarProgress} from './../util/uiHelper';
import verifyCredentials from './../service/authenticationservice';

export default function publishWorkspace() : Thenable<any> {
        
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    
    return showStatusBarProgress('Publishing workspace', 
        verifyCredentials(vscode.window.spgo)
            .then(SpFileGateway.uploadWorkspaceToServer)
            .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel))
    );
}
