'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';
import { ErrorHelper } from '../util/errorHelper';

import { Constants } from './../constants';
import { UrlHelper } from '../util/urlHelper';
import initializeConfiguration from './../dao/configurationDao';

export default function configureWorkspace() : Promise<any> {
    vscode.window.spgo.statusBarItem.text = 'SPGo: Show Menu';

    return getSharePointSiteUrl()
        .then((cfg) => getPublishingScope(cfg))
        .then((cfg) => getAuthenticationType(cfg))
        .then((cfg) => finished(cfg))
        .catch(err => ErrorHelper.handleError(err));
        
    
    function getSharePointSiteUrl() {
        return new Promise((resolve, reject) => {
            initializeConfiguration().then(config => {
                let options: vscode.InputBoxOptions = {
                    ignoreFocusOut: true,
                    placeHolder: 'http[s]://domain.com',
                    value: config.sharePointSiteUrl || '',
                    prompt: 'Please enter the SharePoint site Url',
                };
                vscode.window.showInputBox(options).then(result => {
                    let siteUrl : String = result;
                    
                    if(siteUrl.indexOf('http') != 0){
                        siteUrl = 'https://' + siteUrl;
                    }

                    config.sharePointSiteUrl = UrlHelper.removeTrailingSlash(siteUrl.toString() || config.sharePointSiteUrl || '');

                    if (!config.sharePointSiteUrl) { 
                        reject('SharePoint site Url is required'); 
                    }

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

    function getAuthenticationType(config) {
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

    function finished(config) {
        const defaultOptions: {} = {};
        // prevent the sourceDirectory property from being written to disk
        // this is an internal property only
        delete config.workspaceRoot;
        fs.outputFile(vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME, JSON.stringify(Object.assign(defaultOptions, config), undefined, 4));
        
		config.workspaceRoot = `${vscode.workspace.rootPath}${path.sep}${config.sourceDirectory}`;
        
        return config;
    }
}
