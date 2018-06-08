'use strict';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { IConfig } from './../spgo';
import {IAppManager} from './../spgo';
import {Logger} from '../util/logger';
import {Constants} from './../constants';
import { UrlHelper } from '../util/urlHelper';

export default function initializeConfiguration(appManager?: IAppManager): Promise<IConfig> {
	return new Promise(function (resolve, reject) {
		var self: IAppManager = appManager || vscode.window.spgo;
		try{
			
			if (!vscode.workspace.rootPath) {
				throw { message: 'You must open a folder with VSCode' }
			}

			var configFilePath = vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME;
			
			fs.stat(configFilePath, (err) => {
				try{
					// file exists!
					if( err == null){
						self.config = {...self.config || {}, ... fs.readJsonSync(configFilePath)};
						// this is an internal property only
						self.config.workspaceRoot = `${vscode.workspace.rootPath}${path.sep}${self.config.sourceDirectory}`;
					}
					else{
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
					//Remove the trailing slash if a user enters one, e.g. https://tennant.sharepoint.com/sites/mysite/
					self.config.sharePointSiteUrl = UrlHelper.removeTrailingSlash(self.config.sharePointSiteUrl);
		
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