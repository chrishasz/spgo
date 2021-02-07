'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { ICommand, IConfig } from '../spgo';
import { UrlHelper } from '../util/urlHelper';
import { ErrorHelper } from '../util/errorHelper';
import { WorkspaceHelper } from '../util/workspaceHelper';
import { ConfigurationDao } from '../dao/configurationDao';

/*
* Initialize a new workspace configuration file
*/
export class ConfigureWorkspaceCommand implements ICommand {

    /**
    * Initialize a new workspace configuration file
    * @param {vscode.Uri} fileUri - Optional filepath (Uses current editor if not given)
    * @param {boolean?} props - Optional properties for this command
    */
    execute(_fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            //let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress('Configuring workspace',
                WorkspaceHelper.getActiveWorkspaceUri()
                    .then((activeWorkspace) => {
                        Logger.updateStatusBar('Configuring SPGo', 5);

                        //let rootPath : Uri = vscode.workspace.getWorkspaceFolder(fileUri).uri;

                        return this.getSharePointSiteUrl(activeWorkspace)
                            .then((cfg) => this.getPublishingScope(cfg))
                            .then((cfg) => this.getAuthenticationType(cfg))
                            .then((cfg) => this.finished(cfg, activeWorkspace))
                            .then((cfg) => {
                                Logger.updateStatusBar('SPGo Configuration Complete.', 5)
                                return cfg;
                            });

                    })
                    .catch((err) => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

    public getSharePointSiteUrl(fileUri : Uri) : Promise<any> {
        return new Promise((resolve, reject) => {

            let configFilePath : Uri = Uri.parse(vscode.workspace.getWorkspaceFolder(fileUri).uri + '/' + Constants.CONFIG_FILE_NAME);

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

    public getPublishingScope(config : IConfig) : Thenable<any> {
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

    public getAuthenticationType(config : IConfig) : Thenable<any> {
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
            }, {
                description: 'Impersonate an Addin - common for governance or when 2FA has been enabled.',
                label: 'Addin Only',
                detail: Constants.SECURITY_ADDIN
            }
        ];
        return vscode.window.showQuickPick(options, quickPickOptions).then((res: vscode.QuickPickItem) => {
            config.authenticationType = res.detail;
            return config;
        });
    }

    public finished(config : IConfig, rootPath : Uri) : IConfig {
        const defaultOptions: {} = {};
        // prevent the sourceDirectory property from being written to disk
        // this is an internal property only
        delete config.sourceRoot;
        fs.outputFile(rootPath.fsPath + path.sep + Constants.CONFIG_FILE_NAME, JSON.stringify(Object.assign(defaultOptions, config), undefined, 4));

        config.sourceRoot = `${rootPath.fsPath}${path.sep}${config.sourceDirectory}`;

        return config;
    }
}
