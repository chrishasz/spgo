'use strict';
import * as path from 'path';
import * as SPGo from './spgo';
import * as vscode from 'vscode';

import { IConfig } from './spgo';
import { Logger } from './util/logger';
import { Constants } from './constants';
import { AppManager } from './appManager';
import copySPUrl from './command/copyUrl';
import saveFile from './command/saveFile';
import deleteFile from './command/deleteFile';
import publishFile from './command/publishFile';
import { ErrorHelper } from './util/errorHelper';
import checkOutFile from './command/checkOutFile';
import retrieveFolder from './command/retrieveFolder';
import discardCheckOut from './command/discardCheckOut';
import { WorkspaceHelper } from './util/workspaceHelper';
import getServerVersion from './command/getServerVersion';
import publishWorkspace from './command/publishWorkspace';
import resetCredentials from './command/resetCredentials';
import { ConfigurationDao } from './dao/configurationDao';
import populateWorkspace from './command/populateWorkspace';
import configureWorkspace from './command/configureWorkspace';
import compareFileWithServer from './command/compareFileWithServer';
import getCurrentFileInformation from './command/getCurrentFileInformation';
import { Uri } from 'vscode';

export function activate(context: vscode.ExtensionContext): any {

    //Initialize the global application manager
    vscode.window.spgo = new AppManager();

    // Extension activated.
    Logger.outputMessage('SPGo enabled.', vscode.window.spgo.outputChannel);

    //Check out the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.checkOutFile', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource)
            .then((config : IConfig) => {
                if (selectedResource && selectedResource.path) {
                    checkOutFile(selectedResource, config);
                }
                else {
                    checkOutFile(vscode.window.activeTextEditor.document.uri, config);
                }
            });
    }));

    //Compare the selected file with it's latest version on the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.compareFileWithServer', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource)
            .then((config : IConfig) => {
                    if (selectedResource && selectedResource.path) {
                        compareFileWithServer(selectedResource, config);
                    } else {
                        compareFileWithServer(vscode.window.activeTextEditor.document.uri, config);
                    }
                });
    }));

    //TODO: Figure out how to make this multi-root aware.
    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.configureWorkspace', () => {

        // run config
        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => configureWorkspace(activeWorkspace))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //add Copy URL Commands
    context.subscriptions.push(vscode.commands.registerCommand('spgo.copyRelativeUrl', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource).then((config : IConfig) =>{
            if (config
                && selectedResource
                && selectedResource.fsPath.includes(config.workspaceRoot) ) {
                    copySPUrl(selectedResource, false, config);
            }
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('spgo.copyAbsoluteUrl', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource).then((config : IConfig) =>{
            if (config
                && selectedResource
                && selectedResource.fsPath.includes(config.workspaceRoot) ) {
                    copySPUrl(selectedResource, true, config);
            }
        });
    }));

    //Delete the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.deleteFile', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource)
            .then((config : IConfig) => {
                if (selectedResource && selectedResource.path) {
                    deleteFile(selectedResource, config);
                }
                else {
                    deleteFile(vscode.window.activeTextEditor.document.uri, config);
                }
            });
    }));

    //Discard the checkout of the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.discardCheckOut', (selectedResource?: Uri) => {
        
        vscode.window.spgo.initialize(selectedResource)
            .then((config : IConfig) => {
                if (selectedResource && selectedResource.path) {
                    discardCheckOut(selectedResource, config)
                } else {
                    discardCheckOut(vscode.window.activeTextEditor.document.uri, config);
                }
            });
    }));

    //Delete the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.getServerVersion', (selectedResource?: Uri) => {

        vscode.window.spgo.initialize(selectedResource)
            .then((config : IConfig) => {
                if (selectedResource && selectedResource.path) {
                    getServerVersion(selectedResource, config);
                }
                else {
                    getServerVersion(vscode.window.activeTextEditor.document.uri, config);
                }
            });
    }));

    //Synchronize your local environment from the latest on the server.s
    // Uses the active document to determine the publishing workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.populateWorkspace', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then((config : IConfig) => populateWorkspace(config))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //Synchronize your local environment from the latest on the server.
    // Uses the active document to determine the publishing workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishWorkspace', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then((config : IConfig) => publishWorkspace(config))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMajor', (selectedResource?: Uri) => {
        
        let activeTextEditorUri : Uri = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri : null;
        selectedResource = selectedResource || activeTextEditorUri;

        if( selectedResource && selectedResource.scheme !== 'output'){
            vscode.window.spgo.initialize(selectedResource)
                .then((config : IConfig) => {
                    publishFile(selectedResource, Constants.PUBLISHING_MAJOR, config);
                });
        }
        else{
            Logger.showError('Cannot Publish file: No file selected.');
        }
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMinor', (selectedResource?: Uri) => {
        
        let activeTextEditorUri : Uri = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri : null;
        selectedResource = selectedResource || activeTextEditorUri;

        if( selectedResource && selectedResource.scheme !== 'output'){
            vscode.window.spgo.initialize(selectedResource)
                .then((config : IConfig) => {
                    publishFile(selectedResource, Constants.PUBLISHING_MINOR, config);
                });
        }
        else{
            Logger.showError('Cannot Publish file: No file selected.');
        }
    }));

    //TODO: Figure out how to do this multi-root.
    //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.reloadConfiguration', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then(() => Logger.updateStatusBar('Configuration file reloaded', 5))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //Reset the current user's SharePoint credentials
    context.subscriptions.push(vscode.commands.registerCommand('spgo.resetCredentials', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then((config : IConfig) => resetCredentials(config))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.retrieveFolder', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then((config : IConfig) => retrieveFolder(config))
            .catch(err => ErrorHelper.handleError(err));
    }));

    // autoPublish Feature
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) => {
        vscode.window.spgo.initialize(textDocument.uri)
            .then((config : IConfig) => {
                if (config) {
                    //is the file in the source folder? Save to the server.
                    if (textDocument.fileName.includes(config.workspaceRoot) && Constants.PUBLISHING_NONE != config.publishingScope) {
                        if (Constants.PUBLISHING_MAJOR == config.publishingScope || Constants.PUBLISHING_MINOR == config.publishingScope) {
                            publishFile(textDocument.uri, config.publishingScope, config);
                        }
                        else {
                            saveFile(textDocument.uri, config);
                        }
                    }
                    //is this an update to the config? Reload the config.
                    else if (textDocument.fileName.endsWith(path.sep + Constants.CONFIG_FILE_NAME)) {
                        ConfigurationDao.initializeConfiguration(textDocument.uri)
                            .then(() => {
                                Logger.updateStatusBar('Configuration file reloaded', 5);
                            })
                            .catch((err: SPGo.IError) => {
                                Logger.showError(err.message, err);
                            });
                    }
                }
            });
    }));

    //get file info when the active text document changes.
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((textDocument: vscode.TextDocument) => {
        
        vscode.window.spgo.initialize(textDocument.uri).then((config : IConfig) =>{
            if (config
                && textDocument.fileName.includes(config.workspaceRoot)
                && !textDocument.fileName.endsWith('.git')) {
                    getCurrentFileInformation(textDocument, config);
            }
        });
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
    // Extension activated.
    Logger.outputMessage('SPGo deactivated.', vscode.window.spgo.outputChannel);

    //TODO:Should we clean temp files?
    // if (vscode.window.spgo.config.cleanTempFolderOnExit){

    // }
}