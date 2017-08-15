import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as Logger from './../util/logger';
import initializeConfiguration from './../dao/configurationDao';
import Constants from './../constants';

export default function configureWorkspace() {
    vscode.window.spgo.statusBarItem.text = 'ForceCode: Show Menu';

    return getSharePointSiteUrl()
        .then(cfg => getPublishingScope(cfg))
        .then(cfg => finished(cfg))
        .catch(err => Logger.outputError(err, vscode.window.spgo.outputChannel));
        
    
    function getSharePointSiteUrl() {
        return new Promise(function (resolve, reject) {
            initializeConfiguration().then(config => {
                let options: vscode.InputBoxOptions = {
                    ignoreFocusOut: true,
                    placeHolder: 'http[s]://domain.com',
                    value: config.sharePointSiteUrl || '',
                    prompt: 'Please enter the SharePoint site Url',
                };
                vscode.window.showInputBox(options).then(result => {
                    config.sharePointSiteUrl = result || config.sharePointSiteUrl || '';
                    if (!config.sharePointSiteUrl) { reject('SharePoint site Url is required'); };
                    resolve(config);
                });
            });
        });
    }

    function getPublishingScope(config) {
        let quickPickOptions: vscode.QuickPickOptions = {
            ignoreFocusOut: true
        };
        let options: vscode.QuickPickItem[] = [{
                description: 'Automatically publish files on save',
                label: 'Create a major Version (Publish)',
                detail: Constants.PUBLISHING_MAJOR
            }, {
                description: 'Save a minor version to the server',
                label: 'Create a minor version',
                detail: Constants.PUBLISHING_MINOR
            },{
                description: 'Manually Publish via the VSCode menu or hotkey (alt+shift+p)',
                label: 'Do nothing',
                detail: Constants.PUBLISHING_NONE
            }
        ];
        return vscode.window.showQuickPick(options, quickPickOptions).then((res: vscode.QuickPickItem) => {
            config.publishingScope = res.detail;
            return config;
        });
    }

    function finished(config) {
        const defaultOptions: {} = {};
        fs.outputFile(vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME, JSON.stringify(Object.assign(defaultOptions, config), undefined, 4));
        return config;
    }
}
