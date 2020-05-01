'use strict';
import * as vscode from 'vscode';

import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
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
        return AuthenticationService.verifyCredentials(vscode.window.spgo, config)
            .then(()=>{
                Logger.outputMessage('User Credentials Reset.', vscode.window.spgo.outputChannel)
                Logger.updateStatusBar('User Credentials Reset.', 5)
            })
            .catch(err => ErrorHelper.handleError(err));
    }
    catch (err) {
        return ErrorHelper.handleError(err);
    }
}