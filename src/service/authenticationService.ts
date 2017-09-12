'use strict';
import * as vscode from 'vscode';
import * as sprequest from 'sp-request';

import {IAppManager} from './../spgo';
import {Logger} from '../util/logger';

export class AuthenticationService{
	static verifyCredentials(appManager : IAppManager, payload? : any): Promise<any> {
		appManager = appManager || vscode.window.spgo;
	
		try {
			if(!appManager.credential){
				appManager.credential = {};
				return getUserName(appManager)
					.then(mgr => getPassword(mgr))
					.then(mgr => verify(mgr))
					.then(mgr => processNextCommand(mgr))
			}
			else{
				return processNextCommand(appManager);
			}
		} 
		catch (err) {
			Logger.outputError(err, vscode.window.spgo.outputChannel)
			appManager.credential = {};
		} 
	
		function getUserName(appManager) {
			return new Promise(function (resolve, reject) {
				let options: vscode.InputBoxOptions = {
					ignoreFocusOut: true,
					placeHolder: 'user@domain.com [or domain\\user]',
					value: appManager.credential.username || '',
					prompt: 'Please enter your SharePoint username',
				};
				vscode.window.showInputBox(options).then(result => {
					appManager.credential.username = result || appManager.credential.username || '';
					if (!appManager.credential.username) { 
						reject('No Username'); 
						appManager.credential = null;
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
					value: appManager.credential.password || '',
					placeHolder: 'password',
					prompt: 'Please enter your SharePoint password',
				};
				return vscode.window.showInputBox(options).then(function (result: string) {
					appManager.credential.password = result || appManager.credential.password || '';
					if (!appManager.credential.password) { 
						reject('No Password'); 
						appManager.credential = null;
					};
					resolve(appManager);
				});
			});
		}
	
		// Test the new credential set to make sure it is valid
		function verify(appManager){
			return new Promise(function(resolve, reject) {
				
				let spr = sprequest.create({ 
					username: appManager.credential.username,
					password: appManager.credential.password
				});

				spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
					.then(function(){ //response => {
						resolve(appManager);
					}, err => {
						appManager.credential = null;
						Logger.showError('Invalid user credentials.', err)
						reject(null);
						throw err;
					});
			});
		}

		function processNextCommand(appManager) {
			
			return new Promise(function (resolve, reject) {
				if(appManager && appManager.credential){
					resolve(payload);
				}
				else{
					reject('null credentials.');
				}
			});	
		}
	}
}