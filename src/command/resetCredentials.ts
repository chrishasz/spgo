'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {AuthenticationService} from './../service/authenticationservice';

//Reset the Current user's Credentials.
export default function resetCredentials() : Promise<any> {
    vscode.window.spgo.credential = null;

    return AuthenticationService.verifyCredentials(vscode.window.spgo)
        .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
}