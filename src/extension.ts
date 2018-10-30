'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as SPGo from './spgo';

import {Logger} from './util/logger';
import {Constants} from './constants';
import {AppManager} from './appManager';
import saveFile from './command/saveFile';
import deleteFile from './command/deleteFile';
import publishFile from './command/publishFile';
import checkOutFile from './command/checkOutFile';
import retrieveFolder from './command/retrieveFolder';
import discardCheckOut from './command/discardCheckOut';
import publishWorkspace from './command/publishWorkspace';
import resetCredentials from './command/resetCredentials';
import populateWorkspace from './command/populateWorkspace';
import initializeConfiguration from './dao/configurationDao';
import configureWorkspace from './command/configureWorkspace';
import compareFileWithServer from './command/compareFileWithServer';
import getCurrentFileInformation from './command/getCurrentFileInformation';

export function activate(context: vscode.ExtensionContext): any {

    //Initialize the global application manager
    vscode.window.spgo = new AppManager();

    // Extension activated.
    Logger.outputMessage('SPGo enabled.', vscode.window.spgo.outputChannel);

    //Check out the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.checkOutFile', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            checkOutFile(selectedResource);
        } 
        else {
            checkOutFile(vscode.window.activeTextEditor.document.uri);
        }
    }));

    //Compare the selected file with it's latest version on the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.compareFileWithServer', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            compareFileWithServer(selectedResource);
        } else {
            compareFileWithServer(vscode.window.activeTextEditor.document.uri);
        }
    }));
    
    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.configureWorkspace', () => {
        // run config
        configureWorkspace();
    }));

    //Delete the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.deleteFile', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            deleteFile(selectedResource);
        } 
        else {
            deleteFile(vscode.window.activeTextEditor.document.uri);
        }
    }));

    //Discard the checkout of the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.discardCheckOut', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            discardCheckOut(selectedResource)
        } else {
            discardCheckOut(vscode.window.activeTextEditor.document.uri);
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
            publishFile(selectedResource, Constants.PUBLISHING_MAJOR)
        } 
        else {
            publishFile(vscode.window.activeTextEditor.document.uri, Constants.PUBLISHING_MAJOR);
        }
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMinor', (selectedResource?: vscode.Uri) => {
        if (selectedResource && selectedResource.path) {
            publishFile(selectedResource, Constants.PUBLISHING_MINOR)
        } 
        else {
            publishFile(vscode.window.activeTextEditor.document.uri, Constants.PUBLISHING_MINOR);
        }
    }));

     //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
     context.subscriptions.push(vscode.commands.registerCommand('spgo.reloadConfiguration', () => {
        initializeConfiguration(vscode.window.spgo)
            .then(() => {
                Logger.updateStatusBar('Configuration file reloaded', 5);
            })
            .catch((err : SPGo.IError) => {
                Logger.showError(err.message, err);
            });
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
            if(textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot) && Constants.PUBLISHING_NONE != vscode.window.spgo.config.publishingScope){
                if(Constants.PUBLISHING_MAJOR == vscode.window.spgo.config.publishingScope || Constants.PUBLISHING_MINOR == vscode.window.spgo.config.publishingScope){
                    publishFile(textDocument.uri, vscode.window.spgo.config.publishingScope);
                }
                else{
                    saveFile(textDocument.uri);
                }
            }
            //is this an update to the config? Reload the config.
            else if(textDocument.fileName.endsWith(path.sep + Constants.CONFIG_FILE_NAME)){
                initializeConfiguration(vscode.window.spgo)
                    .then(() => {
                        Logger.updateStatusBar('Configuration file reloaded', 5);
                    })
                    .catch((err : SPGo.IError) => {
                        Logger.showError(err.message, err);
                    });
            }
        }
    }));

    //get file info when the active text document changes.
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((textDocument: vscode.TextDocument) => {
        if (vscode.window.spgo.config 
            && textDocument.fileName.includes(vscode.window.spgo.config.workspaceRoot) 
            && !textDocument.fileName.endsWith('.git')){
                getCurrentFileInformation(textDocument);
        }
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