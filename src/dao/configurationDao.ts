'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { IConfig } from './../spgo';
import { Logger } from '../util/logger';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';

export class ConfigurationDao{

	static initializeConfiguration(contextPath: Uri): Promise<IConfig> {
		return new Promise((resolve, reject) => {
			//var self: IAppManager = appManager || vscode.window.spgo;
			let config : IConfig;
			try{
				
				if (!vscode.workspace.workspaceFolders) {
					throw { message: 'In order to use SPGo, please create a local folder to use as the solution workspace. See https://www.chrishasz.com/spgo/general/getting-started-with-spgo for more info.' }
				}

				let configFilePath : string = contextPath.fsPath;
				let rootPath : Uri = vscode.workspace.getWorkspaceFolder(contextPath).uri;
				
				fs.stat(configFilePath, (err : any) => {
					try{
						if( err == null){
							// file exists!
							config = {...config || {}, ... fs.readJsonSync(configFilePath)};
						}
						else{
							//otherwise create an empty config file
							Logger.outputMessage("Config file does not exist, creating now.\r" + err);
							//create the file
							fs.ensureFileSync(configFilePath);
							// hydrate self.config
							config = config || {};
						}

						//Clean up any possible input issues
						if (typeof config === 'object' && !config.sourceDirectory) {
							config.sourceDirectory = 'src';
						}

						//fix any issues with correct slashes in the src path
						config.sourceDirectory = FileHelper.ensureCorrectPathSeparator(config.sourceDirectory);
						
						//Remove the trailing slash if a user enters one, e.g. https://tennant.sharepoint.com/sites/mysite/
						if(config.sharePointSiteUrl !== undefined){
							config.sharePointSiteUrl = UrlHelper.removeTrailingSlash(config.sharePointSiteUrl);
						}
						//URL Decode any inputs for site Name
						config.sharePointSiteUrl = decodeURI(config.sharePointSiteUrl);

						// this is an internal property only
						config.workspaceRoot = `${rootPath.fsPath}${path.sep}${config.sourceDirectory}`;

						resolve(config);
					} 
					catch (fileErr) {
						Logger.outputError(fileErr);
						config = {};
						config.sourceDirectory = 'src';
						resolve(config);
					}
				});	
			} 
			catch (err) {
				// bad things have happened!
				Logger.showError(err.message, err);
				config = {};
				reject(config);
			}
		});
	}
}