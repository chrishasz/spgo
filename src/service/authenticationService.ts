'use strict';
import * as vscode from 'vscode';

import { IAppManager } from '../spgo';
import { Logger } from '../util/logger';
import { CredentialDao } from '../dao/credentialDao';
import { RequestHelper } from '../util/requestHelper'

export class AuthenticationService{
	
	// Performs Three checks:
	// 1. are the current in-memory credentials valid?
	// 2. If not:
	// 2a. Get new credentials (Username + Password)
	// 2b. Validate User credentials
	// 2c. Fail if new credentials are valid
	// 3. Continue to execute the promise object provided.
	static verifyCredentials(appManager : IAppManager, payload? : any): Promise<any> {
		appManager = appManager || vscode.window.spgo;
	
		try {
			if(!appManager.credentials){
				appManager.credentials = {};
				return getUserName(appManager)
					.then((mgr : IAppManager) => getPassword(mgr))
					.then((mgr : IAppManager) => verify(mgr))
					.then((mgr : IAppManager) => processNextCommand(mgr));
			}
			else{
				return processNextCommand(appManager);
			}
		} 
		catch (err) {
			Logger.outputError(err, vscode.window.spgo.outputChannel)
			appManager.credentials = {};
		} 
	
		// take user's SharePoint username input
		function getUserName(appManager : IAppManager) {
			return new Promise((resolve, reject) => {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					placeHolder: 'user@domain.com [or domain\\user]',
					value: appManager.credentials.username || '',
					prompt: 'Please enter your SharePoint username',
				};
				vscode.window.showInputBox(options).then(result => {
					appManager.credentials.username = result || appManager.credentials.username || '';
					if (!appManager.credentials.username) { 
						reject('No Username'); 
						appManager.credentials = null;
					};
					resolve(appManager);
				});
			});
		}
	
		// take user's password input
		function getPassword(appManager : IAppManager) {
			return new Promise((resolve, reject) => {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					password: true,
					value: appManager.credentials.password || '',
					placeHolder: 'password',
					prompt: 'Please enter your SharePoint password',
				};
				return vscode.window.showInputBox(options).then((result: string) => {
					appManager.credentials.password = result || appManager.credentials.password || '';
					if (!appManager.credentials.password) { 
						reject('No Password'); 
						appManager.credentials = null;
					};
					resolve(appManager);
				});
			});
		}
	
		// Test the new credential set to make sure it is valid
		function verify(appManager : IAppManager){
			return new Promise((resolve, reject) => {
				
				let spr = RequestHelper.createRequest(appManager);

				spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
					.then(() => { //response => {
						//store credentials?
						if(appManager.config.storeCredentials){
							CredentialDao.setCredentials(vscode.window.spgo.config.sharePointSiteUrl, appManager.credentials);
							//return processNextCommand(appManager);
						}
						resolve(appManager);
					}, err => {
						appManager.credentials = null;
						reject(err);
					});
			});
		}

		// Authentication was successful, process the command provided by the caller.
		function processNextCommand(appManager : IAppManager) {			
			return new Promise((resolve, reject) => {
				if(appManager && appManager.credentials){
					resolve(payload);
				}
				else{
					reject('null credentials.');
				}
			});	
		}
	}
}