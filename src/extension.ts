'use strict';
import * as vscode from 'vscode';
import { AppManager } from './appManager';
import * as path from 'path';


import {Logger} from './util/logger';
import configureWorkspace from './command/configureWorkspace';
import initializeConfiguration from './dao/configurationDao';
import discardCheckOut from './command/discardCheckOut';
import resetCredentials from './command/resetCredentials';
import populateWorkspace from './command/populateWorkspace';
import publishWorkspace from './command/publishWorkspace';
import retrieveFolder from './command/retrieveFolder';
import checkOutFile from './command/checkOutFile';
import publishFile from './command/publishFile';
import saveFile from './command/saveFile';
import getCurrentFileInformation from './command/getCurrentFileInformation';
import Constants from './constants';

export function activate(context: vscode.ExtensionContext): any {

    //Initialize the global application manager
    vscode.window.spgo = new AppManager();

    // Extension activated.
    Logger.outputMessage('SPGo enabled.', vscode.window.spgo.outputChannel);

    //Check out the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.checkOutFile', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => checkOutFile(doc));
        } 
        else {
            checkOutFile(vscode.window.activeTextEditor.document);
        }
    }));
    
    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.configureWorkspace', () => {
        // run config
        configureWorkspace();
    }));

    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.discardCheckOut', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => discardCheckOut(doc));
        } else {
            discardCheckOut(vscode.window.activeTextEditor.document);
        }
    }));

    //Synchronize your local environment from the latest on the server
    context.subscriptions.push(vscode.commands.registerCommand('spgo.populateWorkspace', () => {
        populateWorkspace();
    }));

    //Synchronize your local environment from the latest on the server
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishWorkspace', () => {
        publishWorkspace();
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMajor', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => publishFile(doc, Constants.PUBLISHING_MAJOR));
        } 
        else {
            publishFile(vscode.window.activeTextEditor.document, Constants.PUBLISHING_MAJOR);
        }
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMinor', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            vscode.workspace.openTextDocument(selectedResource)
                .then(doc => publishFile(doc, Constants.PUBLISHING_MINOR));
        } 
        else {
            publishFile(vscode.window.activeTextEditor.document, Constants.PUBLISHING_MINOR);
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

    // autoPublish Feature
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) => {
        if (vscode.window.spgo.config) {
            //is the file in the source folder? Save to the server.
            if(textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
                saveFile(textDocument);// , context);
            }
            //is this an update to the config? Reload the config.
            else if(textDocument.fileName.endsWith(path.sep + Constants.CONFIG_FILE_NAME)){
                initializeConfiguration(vscode.window.spgo)
                    .then(function() {
                        Logger.outputMessage('Configuration file reloaded', vscode.window.spgo.outputChannel);
                    })
                    .catch(function(err) {
                        Logger.outputError(err, vscode.window.spgo.outputChannel);
                    });
            }
        }
    }));

    //get file info when the active text document changes.
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((textDocument: vscode.TextDocument) => {
        if (vscode.window.spgo.config && textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot)){
            getCurrentFileInformation(textDocument);
        }
    }));


}

// this method is called when your extension is deactivated
export function deactivate() {
    // Extension activated.
    Logger.outputMessage('SPGo deactivated.', vscode.window.spgo.outputChannel);
}