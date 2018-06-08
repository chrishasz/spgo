'use strict';
import * as vscode from 'vscode';

import { IAppManager } from './../spgo';
import { Logger } from '../util/logger';
import { CredentialDao } from '../dao/credentialDao';
import { RequestHelper } from './../util/requestHelper'

export class AuthenticationService{
	static verifyCredentials(appManager : IAppManager, payload? : any): Promise<any> {
		appManager = appManager || vscode.window.spgo;
	
		try {
			if(!appManager.credentials){
				appManager.credentials = {};
				return getUserName(appManager)
					.then(mgr => getPassword(mgr))
					.then(mgr => verify(mgr))
					.then(mgr => processNextCommand(mgr));
			}
			else{
				return processNextCommand(appManager);
			}
		} 
		catch (err) {
			Logger.outputError(err, vscode.window.spgo.outputChannel)
			appManager.credentials = {};
		} 
	
		function getUserName(appManager) {
			return new Promise(function (resolve, reject) {
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
	
		function getPassword(appManager) {
			return new Promise(function (resolve, reject) {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					password: true,
					value: appManager.credentials.password || '',
					placeHolder: 'password',
					prompt: 'Please enter your SharePoint password',
				};
				return vscode.window.showInputBox(options).then(function (result: string) {
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
		function verify(appManager){
			return new Promise(function(resolve, reject) {
				
				let spr = RequestHelper.createRequest(appManager);

				spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
					.then(function(){ //response => {
						//store credentials?
						if(appManager.config.storeCredentials){
							CredentialDao.setCredentials(vscode.window.spgo.config.sharePointSiteUrl, appManager.credentials);
							return processNextCommand(appManager);
						}
						resolve(appManager);
					}, err => {
						appManager.credentials = null;
						reject(err);
					});
			});
		}

		function processNextCommand(appManager) {			
			return new Promise(function (resolve, reject) {
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