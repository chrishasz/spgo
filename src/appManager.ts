'use strict';

import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from './spgo';
import { Memento, Uri } from 'vscode';
import { Logger } from './util/logger';
import { Constants } from './constants';
import { LocalStorageService } from './service/localStorageService';
import { IAppManager, ICredential } from './spgo';
import { CredentialDao } from './dao/credentialDao';
import { ConfigurationDao } from './dao/configurationDao';
import configureWorkspace from './command/configureWorkspace';

export class AppManager implements IAppManager {
    public configSet : Map<string, IConfig>;
    public credentials : ICredential;
    public localStore : LocalStorageService;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;
    
    constructor( storageContext : Memento) {
        this.configSet = new Map<string, IConfig>();
        this.credentials = null;
        this.localStore = new LocalStorageService(storageContext);
        this.outputChannel = vscode.window.createOutputChannel(Constants.OUTPUT_CHANNEL_NAME);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 5);
    }

    public initialize(contextPath : Uri){
        return new Promise((resolve, reject) => {
            let workspaceFolder : Uri = vscode.workspace.getWorkspaceFolder(contextPath) ? vscode.workspace.getWorkspaceFolder(contextPath).uri : null;
            if(!workspaceFolder){
                reject('No active workspace selected');
            }
            
            let configFilePath : Uri = Uri.parse(vscode.workspace.getWorkspaceFolder(contextPath).uri + '/' + Constants.CONFIG_FILE_NAME);

            if(this.configSet.has(workspaceFolder.fsPath)){
                resolve(this.configSet.get(workspaceFolder.fsPath));
            }
            else{
                //initialize Configuration file
                fs.stat(configFilePath.fsPath, (err : any) => {
                    // config file exists!
                    if( err == null){
                        ConfigurationDao.initializeConfiguration(configFilePath).then((config : IConfig)=> {
                            //stored credentials?
                            if(config.storeCredentials){
                                vscode.window.spgo.credentials = CredentialDao.getCredentials(config.sharePointSiteUrl);
                            }
                            vscode.window.spgo.statusBarItem.text = 'SPGo enabled';
                            vscode.window.spgo.statusBarItem.show();

                            //cache config
                            this.configSet.set(workspaceFolder.fsPath, config);

                            resolve(config);

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
                                reject('SPGo initialization cancelled by user.');
                            }
                            else{
                                configureWorkspace(contextPath)
                                    .then((config : IConfig) => 
                                    {
                                        vscode.window.spgo.statusBarItem.text = 'SPGo enabled';
                                        vscode.window.spgo.statusBarItem.show();
                                        
                                        //cache config
                                        this.configSet.set(workspaceFolder.fsPath, config);

                                        resolve(config);
                                    });
                            }
                        });
                    }
                });
            }
        });
    }
}