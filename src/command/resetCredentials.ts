'use strict';
import * as vscode from 'vscode';

import { ErrorHelper } from '../util/errorHelper';
import { AuthenticationService } from './../service/authenticationService';
import { CredentialDao } from '../dao/credentialDao';

//Reset the Current user's Credentials.
export default function resetCredentials() : Promise<any> {
    vscode.window.spgo.credentials = null;

    //clear stored credentials
    if(vscode.window.spgo.config.storeCredentials){
        CredentialDao.deleteCredentials(vscode.window.spgo.config.sharePointSiteUrl);
    }

    return AuthenticationService.verifyCredentials(vscode.window.spgo)
        .catch(err => ErrorHelper.handleError(err));
}