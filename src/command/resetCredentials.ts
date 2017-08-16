import * as vscode from 'vscode';
import * as logger from './../util/logger';
import verifyCredentials from './../service/authenticationservice';

//Reset the Current user's Credentials.
export default function resetCredentials() : Promise<any> {
    
    vscode.window.spgo.credential = null;

    return verifyCredentials(vscode.window.spgo)
        .catch(err => logger.outputError(err, vscode.window.spgo.outputChannel));
}