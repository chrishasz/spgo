import * as vscode from 'vscode';
import {Credential} from './model/credential';
import {IAppManager} from './spgo';
import {IConfig} from './spgo';
import {ICredential} from './spgo';
import constants from './constants';
import initializeConfiguration from './dao/configurationDao';

export class AppManager implements IAppManager {
    public config : IConfig;
    public credentials : ICredential;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;
    
    constructor() {
        this.credentials = new Credential('','');
        this.outputChannel = vscode.window.createOutputChannel(constants.OUTPUT_CHANNEL_NAME);
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 5);

        //initialize Configuration file
        initializeConfiguration(this).then(config => {
            this.statusBarItem.text = 'SPGo is Active';
        }).catch(err => {
            this.statusBarItem.text = 'SPGo: Missing Configuration';
        });
        this.statusBarItem.show();
    }
}