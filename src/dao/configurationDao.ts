import * as vscode from 'vscode';
import { IConfig } from './../spgo';
import {IAppManager} from './../spgo';
import * as fs from 'fs-extra';
import * as path from 'path';
import Constants from './../constants';
import * as _ from 'lodash' 
import * as logger from '../util/logger';

export default function initializeConfiguration(appManager?: IAppManager): Promise<IConfig> {
	return new Promise(function (resolve, reject) {
		var self: IAppManager = appManager || vscode.window.spgo;
		if (!vscode.workspace.rootPath) {
			throw { message: 'You must open a folder with VSCode' }
		}
		try {
			var configFilePath = vscode.workspace.rootPath + path.sep + Constants.CONFIG_FILE_NAME;
			
			//not a fan of this try/catch file checking, but fs-extra does not provide a "does exist?" method.
			//TODO: research a better FS library
			try{
				self.config = _.extend(self.config || {}, fs.readJsonSync(configFilePath));
			}
			catch(err){
				//ensure the file exists
				fs.ensureFileSync(configFilePath);
				// hydrage self.config
				self.config = self.config || {};
			}

			if (typeof self.config === 'object' && !self.config.sourceDirectory) {
				self.config.sourceDirectory = 'src';
			}
			self.config.workspaceRoot = `${vscode.workspace.rootPath}${path.sep}${self.config.sourceDirectory}`;
			if (!fs.existsSync(self.config.workspaceRoot)) {
				fs.mkdirSync(self.config.workspaceRoot);
			}
			resolve(self.config);
		} 
		catch (err) {
			// bad things have happened!
			logger.outputError(err, self.outputChannel)
			self.config = {};
			reject(self.config);
		}
	});
}