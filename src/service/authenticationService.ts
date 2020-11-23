'use strict';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { IAppManager, IConfig } from '../spgo';
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
	static verifyCredentials(appManager : IAppManager, config : IConfig, payload? : any): Promise<any> {
		appManager = appManager || vscode.window.spgo;
		//let config : IConfig = workspaceConfig;

		try {
			if(!appManager.credentials){
				appManager.credentials = {};
				if( config.authenticationType && config.authenticationType === Constants.SECURITY_ADDIN ){
					return getClientId(appManager)
						.then((mgr : IAppManager) => getClientSecret(mgr))
						.then((mgr : IAppManager) => getRealm(mgr))
						.then((mgr : IAppManager) => verify(mgr))
						.then((mgr : IAppManager) => processNextCommand(mgr));
				}
				else{
					return getUserName(appManager)
						.then((mgr : IAppManager) => getPassword(mgr))
						.then((mgr : IAppManager) => verify(mgr))
						.then((mgr : IAppManager) => processNextCommand(mgr));
				}
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
		function getClientId(appManager : IAppManager) {
			return new Promise((resolve, reject) => {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					placeHolder: '<client Id>',
					value: appManager.credentials.clientId || '',
					prompt: 'Please enter the Client Id for this extension',
				};
				vscode.window.showInputBox(options).then(result => {
					appManager.credentials.clientId = result || appManager.credentials.clientId || '';
					if (!appManager.credentials.clientId) { 
						reject('No ClientId'); 
						appManager.credentials = null;
					};
					resolve(appManager);
				});
			});
		}

		// take user's SharePoint username input
		function getClientSecret(appManager : IAppManager) {
			return new Promise((resolve, reject) => {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					password: true,
					placeHolder: '<client secret>',
					value: appManager.credentials.clientSecret || '',
					prompt: 'Please enter the Client Secret for this extension',
				};
				vscode.window.showInputBox(options).then(result => {
					appManager.credentials.clientSecret = result || appManager.credentials.clientSecret || '';
					if (!appManager.credentials.clientSecret) { 
						reject('No Client Secret'); 
						appManager.credentials = null;
					};
					resolve(appManager);
				});
			});
		}

		// take user's SharePoint username input
		function getRealm(appManager : IAppManager) {
			return new Promise((resolve/*, reject*/) => {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					placeHolder: '<realm>',
					value: appManager.credentials.realm || '',
					prompt: '(Optional) Please enter the Realm for this extension',
				};
				vscode.window.showInputBox(options).then(result => {
					appManager.credentials.realm = result || appManager.credentials.realm || '';
					// if (!appManager.credentials.realm) { 
					// 	reject('No Realm'); 
					// 	appManager.credentials = null;
					// };
					resolve(appManager);
				});
			});
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
				
				let spr = RequestHelper.createRequest(appManager, config);

				spr.requestDigest(config.sharePointSiteUrl)
					.then(() => { //response => {
						//store credentials?
						if(config.storeCredentials){//} && config.authenticationType !== Constants.SECURITY_ADDIN){
							CredentialDao.setCredentials(config.sharePointSiteUrl, appManager.credentials);
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