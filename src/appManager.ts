'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from './spgo';
import { Logger } from './util/logger';
import { Constants } from './constants';
import { IAppManager, ICredential } from './spgo';
import { CredentialDao } from './dao/credentialDao';
import initializeConfiguration from './dao/configurationDao';
import configureWorkspace from './command/configureWorkspace';

export class AppManager implements IAppManager {
    public config : IConfig;
    public credentials : ICredential;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;
    
    constructor() {
        this.credentials = null;
        this.outputChannel = vscode.window.createOutputChannel(Constants.OUTPUT_CHANNEL_NAME);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 5);
    }

    public initialize(){
        return new Promise((resolve, reject) => {
            let configFilePath : string = vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME;

            if( this.config === undefined){
                //initialize Configuration file
                fs.stat(configFilePath, (err) => {
                    // config file exists!
                    if( err == null){
                        initializeConfiguration(vscode.window.spgo).then(()=> {
                            //stored credentials?
                            if(vscode.window.spgo.config.storeCredentials){
                                vscode.window.spgo.credentials = CredentialDao.getCredentials(this.config.sharePointSiteUrl);
                            }
                            vscode.window.spgo.statusBarItem.text = 'SPGo enabled';
                            vscode.window.spgo.statusBarItem.show();

                            resolve();

                        }).catch(err => {
                            Logger.showError('SPGo: Missing Configuration');
                            Logger.outputError(err);
                            reject();
                        });
                    }
                    else{
                        // run config
                        vscode.window.showWarningMessage('SPGo has not been configured for this project. Would you like to configure your workspace now?', Constants.OPTIONS_YES, Constants.OPTIONS_NO)
                        .then(result => {
                            if( result == Constants.OPTIONS_NO){
                                Logger.outputMessage('SPGo initialization cancelled by user.');
                                reject();
                            }
                            else{
                                configureWorkspace()
                                    .then(() => 
                                    {
                                        vscode.window.spgo.statusBarItem.text = 'SPGo enabled';
                                        vscode.window.spgo.statusBarItem.show();
                                        resolve();
                                    });
                            }
                        });
                    }
                });
            }
            else{
                resolve();
            }
        });
    }
}