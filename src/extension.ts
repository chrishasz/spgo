'use strict';
import * as vscode from 'vscode';
//import * as spgoData from './spgo';
import { AppManager } from './appManager';
import * as logger from './util/logger';
import * as path from 'path';
import configureWorkspace from './command/configureWorkspace';
import initializeConfiguration from './dao/configurationDao';
import resetCredentials from './command/resetCredentials';
import synchronizeFiles from './command/synchronizeFiles';
import retrieveFolder from './command/retrieveFolder';
import checkOutFile from './command/checkOutFile';
import publishFile from './command/publishFile';
import saveFile from './command/saveFile';
import Constants from './constants';

export function activate(context: vscode.ExtensionContext): any {

    //Initialize the global application manager
    vscode.window.spgo = new AppManager();

    // Extension activated.
    logger.outputMessage('SPGo enabled.', vscode.window.spgo.outputChannel);

    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.configureWorkspace', () => {
        // run config
        configureWorkspace();
    }));

    //Check out the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.checkOutFile', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => checkOutFile(doc, context));
        } else {
            checkOutFile(vscode.window.activeTextEditor.document, context);
        }
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publish', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => publishFile(doc, context));
        } 
        else {
            publishFile(vscode.window.activeTextEditor.document, context);
        }
    }));

    //Reset the current user's SharePoint credentials
    context.subscriptions.push(vscode.commands.registerCommand('spgo.resetCredentials', () => {
        resetCredentials();
    }));

    //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.retrieveFolder', () => {
        retrieveFolder();
    }));

    //Synchronize your local environment from the latest on the server
    context.subscriptions.push(vscode.commands.registerCommand('spgo.synchronizeFiles', () => {
        synchronizeFiles();
    }));

    // autoPublish Feature
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) => {
        if (vscode.window.spgo.config) {
            //is the file in the source folder? Save to the server.
            if(textDocument.fileName.indexOf(vscode.window.spgo.config.workspaceRoot) == 0 ){
                saveFile(textDocument, context);
            }
            //is this an update to the config? Reload the config.
            else if(textDocument.fileName.endsWith(path.sep + Constants.CONFIG_FILE_NAME)){
                initializeConfiguration(vscode.window.spgo)
                    .then(function(downloadResults) {
                        logger.outputMessage('Configuration file reloaded', vscode.window.spgo.outputChannel);
                    })
                    .catch(function(err) {
                        logger.outputError(err, vscode.window.spgo.outputChannel);
                    });
            }
        }
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
    // Extension activated.
    logger.outputMessage('SPGo deactivated.', vscode.window.spgo.outputChannel);
}