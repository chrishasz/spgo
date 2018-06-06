'use strict';
import * as vscode from 'vscode';

import { IConfig } from './spgo';
import { Logger } from './util/logger';
import { Constants } from './constants';
import { Credential } from './model/credential';
import { IAppManager, ICredential } from './spgo';
import { CredentialDao } from './dao/credentialDao';
import initializeConfiguration from './dao/configurationDao';

export class AppManager implements IAppManager {
    public config : IConfig;
    public credentials : ICredential;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;
    
    constructor() {
        this.credentials = new Credential('','');
        this.outputChannel = vscode.window.createOutputChannel(Constants.OUTPUT_CHANNEL_NAME);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 5);

        //initialize Configuration file
        initializeConfiguration(this).then(()=> {
            //stored credentials?
            if(this.config.storeCredentials){
                this.credentials = CredentialDao.getCredentials(this.config.sharePointSiteUrl);
            }
            this.statusBarItem.text = 'SPGo enabled';
        }).catch(err => {
            Logger.showError('SPGo: Missing Configuration');
            Logger.outputError(err);
        });
        
        this.statusBarItem.show();
    }
}