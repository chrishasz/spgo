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
							//file exists!
							config = {...config || {}, ... fs.readJsonSync(configFilePath)};
						}
						else{
							//otherwise create an empty config file
							Logger.outputMessage("Config file does not exist, creating now.\r" + err);
							//create the file
							fs.ensureFileSync(configFilePath);
							//hydrate self.config
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

						//Set up internal workspace and source roots
						config.workspaceRoot = `${rootPath.fsPath}`;
						config.sourceRoot = `${config.workspaceRoot}${path.sep}${config.sourceDirectory}`;

						//set up workspace publishing options
						if( config.publishWorkspaceGlobPattern )
						{
							//this property is deprecated
							Logger.outputMessage('The publishWorkspaceGlobPattern property has been deprecated. Please use publishWorkspaceOptions instead: https://www.chrishasz.com/spgo/general/config-options#publishWorkspaceOptions');
						}

                        //TODO: make globPattern take an optional array of glob patterns.

						// if( !config.publishWorkspaceOptions ){
						// 	config.publishWorkspaceOptions = {
						// 		destinationFolder : '/',
						// 		localRoot : config.sourceRoot
						// 		globPattern : config.publishWorkspaceGlobPattern ? config.sourceRoot + UrlHelper.ensureLeadingSlash(config.publishWorkspaceGlobPattern) : config.sourceRoot + UrlHelper.osAwareGlobStar(),
						// 	};
						// }
						// else{
                        //     config.publishWorkspaceOptions.destinationFolder = config.publishWorkspaceOptions.destinationFolder || '/';
                        //     config.publishWorkspaceOptions.localRoot = this.calculateLocalRoot(config);
						//     config.publishWorkspaceOptions.globPattern = this.calculateGlobPattern(config);
						// }
                        //set up the publish workspace options
                        config.publishWorkspaceOptions = config.publishWorkspaceOptions || {};
                        config.publishWorkspaceOptions.destinationFolder = config.publishWorkspaceOptions.destinationFolder || '/';
                        config.publishWorkspaceOptions.localRoot = this.calculateLocalRoot(config);
                        config.publishWorkspaceOptions.globPattern = this.calculateGlobPattern(config);

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

    static calculateLocalRoot(config : IConfig): string{
        let localRoot : string = config.publishWorkspaceOptions.localRoot;

        if(localRoot){
            if(!path.isAbsolute(localRoot)){
                localRoot = config.workspaceRoot + path.sep + localRoot;
            }
        }
        else{
            localRoot = config.sourceRoot;
        }

        return localRoot;
    }

    static calculateGlobPattern(config : IConfig) : string[]{
        let globPattern : string[] = [];// = [config.publishWorkspaceOptions.globPattern];

        if(config.publishWorkspaceOptions.globPattern){
            if(Array.isArray(config.publishWorkspaceOptions.globPattern)){
                return config.publishWorkspaceOptions.globPattern;
            }
            else{
                if(!path.isAbsolute(config.publishWorkspaceOptions.globPattern)){
                    globPattern.push(config.publishWorkspaceOptions.localRoot + UrlHelper.ensureLeadingWebSlash(config.publishWorkspaceOptions.globPattern));
                }
            }
        }
        else{
            globPattern.push(config.publishWorkspaceOptions.localRoot + UrlHelper.osAwareGlobStar());
        }

        return globPattern;
    }
}
