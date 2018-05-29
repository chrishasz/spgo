'use strict';
import * as vscode from 'vscode';

import { ErrorHelper } from '../util/errorHelper';
import {AuthenticationService} from './../service/authenticationService';

//Reset the Current user's Credentials.
export default function resetCredentials() : Promise<any> {
    vscode.window.spgo.credential = null;

    return AuthenticationService.verifyCredentials(vscode.window.spgo)
    .catch(err => ErrorHelper.handleError(err));
}