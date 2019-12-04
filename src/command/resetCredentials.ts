'use strict';
import * as vscode from 'vscode';

import { IConfig } from '../spgo';
import { ErrorHelper } from '../util/errorHelper';
import { CredentialDao } from '../dao/credentialDao';
import { AuthenticationService } from '../service/authenticationService';

//Reset the Current user's Credentials.
export default async function resetCredentials(config : IConfig) : Promise<any> {
    vscode.window.spgo.credentials = null;

    //clear stored credentials
    if(config.storeCredentials){
        CredentialDao.deleteCredentials(config.sharePointSiteUrl);
    }

    try {
        return AuthenticationService.verifyCredentials(vscode.window.spgo, config);
    }
    catch (err) {
        return ErrorHelper.handleError(err);
    }
}