'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UrlHelper } from '../util/urlHelper';
import { ErrorHelper } from '../util/errorHelper';
import { ConfigurationDao } from '../dao/configurationDao';

export default function configureWorkspace(contextPath : Uri) : Promise<any> {

    
    Logger.updateStatusBar('Configuring SPGo', 5);

    let rootPath : Uri = vscode.workspace.getWorkspaceFolder(contextPath).uri;

    return getSharePointSiteUrl()
        .then((cfg) => getPublishingScope(cfg))
        .then((cfg) => getAuthenticationType(cfg))
        .then((cfg) => finished(cfg))
        .then(() => Logger.updateStatusBar('SPGo Configuration Complete.', 5))
        .catch((err) => ErrorHelper.handleError(err));
        
    
    function getSharePointSiteUrl() {
        return new Promise((resolve, reject) => {

            let configFilePath : Uri = Uri.parse(vscode.workspace.getWorkspaceFolder(contextPath).uri + '/' + Constants.CONFIG_FILE_NAME);

            ConfigurationDao.initializeConfiguration(configFilePath).then(config => {
                let options: vscode.InputBoxOptions = {
                    ignoreFocusOut: true,
                    placeHolder: 'http[s]://domain.com',
                    value: config.sharePointSiteUrl || 'http[s]://domain.com',
                    prompt: 'Please enter the SharePoint site Url',
                };
                vscode.window.showInputBox(options).then((result) => {
                    let siteUrl : string = result;
                    
                    if(siteUrl.indexOf('http') != 0){
                        siteUrl = 'https://' + siteUrl;
                    }

                    //remove trailing slash (if present)
                    config.sharePointSiteUrl = UrlHelper.removeTrailingSlash(siteUrl || config.sharePointSiteUrl || '');
					//URL Decode any inputs for site Name
					config.sharePointSiteUrl = decodeURI(config.sharePointSiteUrl);

                    if (!config.sharePointSiteUrl) { 
                        reject('SharePoint site Url is required'); 
                    }

                    resolve(config);
                });
            });
        });
    }

    function getPublishingScope(config : IConfig) {
        let quickPickOptions: vscode.QuickPickOptions = {
            ignoreFocusOut: true
        };
        let options: vscode.QuickPickItem[] = [{
                description: 'Save the file to the server, but do not publish. You must manually publish via the VSCode menu or hotkey (alt+shift+p)',
                label: 'Save and keep editing',
                detail: Constants.PUBLISHING_SAVEONLY
            },{
                description: 'Automatically publish files on save',
                label: 'Create a major Version (Publish)',
                detail: Constants.PUBLISHING_MAJOR
            }, {
                description: 'Save a minor version to the server',
                label: 'Create a minor version',
                detail: Constants.PUBLISHING_MINOR
            },{
                description: 'Do not save the file to the server. You must manually publish via the VSCode menu or hotkey (alt+shift+p)',
                label: 'Do nothing',
                detail: Constants.PUBLISHING_NONE
            }
        ];
        return vscode.window.showQuickPick(options, quickPickOptions).then((res: vscode.QuickPickItem) => {
            config.publishingScope = res.detail;
            return config;
        });
    }

    function getAuthenticationType(config : IConfig) {
        let quickPickOptions: vscode.QuickPickOptions = {
            ignoreFocusOut: true
        };
        let options: vscode.QuickPickItem[] = [{
                description: 'Used in Office 365 instances',
                label: 'Digest',
                detail: Constants.SECURITY_DIGEST
            },{
                description: 'Used to authenticate against a system on a Windows domain or stand-alone systems.',
                label: 'NTLM',
                detail: Constants.SECURITY_NTLM
            }, {
                description: 'Common username/password setup for web sites.',
                label: 'Forms',
                detail: Constants.SECURITY_FORMS
            }, {
                description: 'Used to authenticate against a system using federated authentication.',
                label: 'ADFS',
                detail: Constants.SECURITY_ADFS
            }
        ];
        return vscode.window.showQuickPick(options, quickPickOptions).then((res: vscode.QuickPickItem) => {
            config.authenticationType = res.detail;
            return config;
        });
    }

    function finished(config : IConfig) {
        const defaultOptions: {} = {};
        // prevent the sourceDirectory property from being written to disk
        // this is an internal property only
        delete config.sourceRoot;
        fs.outputFile(rootPath.fsPath + path.sep + Constants.CONFIG_FILE_NAME, JSON.stringify(Object.assign(defaultOptions, config), undefined, 4));
        
		config.sourceRoot = `${rootPath.fsPath}${path.sep}${config.sourceDirectory}`;
        
        return config;
    }
}
