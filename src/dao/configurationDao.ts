'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import {IConfig} from './../spgo';
import {IAppManager} from './../spgo';
import {Logger} from '../util/logger';
import {Constants} from './../constants';
import {UrlHelper} from '../util/urlHelper';
import {FileHelper} from '../util/fileHelper';

export default function initializeConfiguration(appManager?: IAppManager): Promise<IConfig> {
	return new Promise((resolve, reject) => {
		var self: IAppManager = appManager || vscode.window.spgo;
		try{
			
			if (!vscode.workspace.workspaceFolders) {
				throw { message: 'In order to use SPGo, please create a local folder to use as the solution workspace. See https://www.chrishasz.com/spgo/general/getting-started-with-spgo for more info.' }
			}

			var configFilePath = vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME;
			
			fs.stat(configFilePath, (err) => {
				try{
					if( err == null){
						// file exists!
						self.config = {...self.config || {}, ... fs.readJsonSync(configFilePath)};
					}
					else{
						//otherwise create an empty config file
						Logger.outputMessage("Config file does not exist, creating now.\r" + err);
						//create the file
						fs.ensureFileSync(configFilePath);
						// hydrate self.config
						self.config = self.config || {};
					}

					//Clean up any possible input issues
					if (typeof self.config === 'object' && !self.config.sourceDirectory) {
						self.config.sourceDirectory = 'src';
					}

					//fix any issues with correct slashes in the src path
					self.config.sourceDirectory = FileHelper.ensureCorrectPathSeparator(self.config.sourceDirectory);
					
					//Remove the trailing slash if a user enters one, e.g. https://tennant.sharepoint.com/sites/mysite/
					if(self.config.sharePointSiteUrl !== undefined){
						self.config.sharePointSiteUrl = UrlHelper.removeTrailingSlash(self.config.sharePointSiteUrl);
					}
					//URL Decode any inputs for site Name
					self.config.sharePointSiteUrl = decodeURI(self.config.sharePointSiteUrl);

					// this is an internal property only
					self.config.workspaceRoot = `${vscode.workspace.rootPath}${path.sep}${self.config.sourceDirectory}`;

					resolve(self.config);
				} 
				catch (fileErr) {
					Logger.outputError(fileErr);
					self.config = {};
					self.config.sourceDirectory = 'src';
					resolve(self.config);
				}
			});	
		} 
		catch (err) {
			// bad things have happened!
			Logger.showError(err.message, err);
			self.config = {};
			reject(self.config);
		}
	});
}