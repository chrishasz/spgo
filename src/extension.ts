'use strict';
import * as path from 'path';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from './util/logger';
import { Constants } from './constants';
import { AppManager } from './appManager';
import { ICommand, IConfig } from './spgo';
import { ErrorHelper } from './util/errorHelper';
import { WorkspaceHelper } from './util/workspaceHelper';
import { SaveFileCommand } from './command/saveFileCommand';
import { CopySPUrlCommand } from './command/copySPUrlCommand';
import { DeleteFileCommand } from './command/deleteFileCommand';
import { PublishFileCommand } from './command/publishFileCommand';
import { CheckOutFileCommand } from './command/checkOutFileCommand';
import { RetrieveFolderCommand } from './command/retrieveFolderCommand';
import { DiscardCheckOutCommand } from './command/discardCheckOutCommand';
import { GetServerVersionCommand } from './command/getServerVersionCommand';
import { PublishWorkspaceCommand } from './command/publishWorkspaceCommand';
import { ResetCredentialsCommand } from './command/resetCredentialsCommand';
import { PopulateWorkspaceCommand } from './command/populateWorkspaceCommand';
import { ConfigureWorkspaceCommand } from './command/configureWorkspaceCommand';
import { CompareFileWithServerCommand } from './command/compareFileWithServerCommand';
import { GetCurrentFileInformationCommand } from './command/getCurrentFileInformationCommand';

export function activate(context: vscode.ExtensionContext): any {

    //Initialize the global application manager
    vscode.window.spgo = new AppManager(context.workspaceState);

    // Extension activated.
    Logger.outputMessage('SPGo enabled.', vscode.window.spgo.outputChannel);

    //Check out the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.checkOutFile', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new CheckOutFileCommand();
        command.execute(selectedResource);
    }));

    //Compare the selected file with it's latest version on the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.compareFileWithServer', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new CompareFileWithServerCommand();
        command.execute(selectedResource);
    }));

    //Create the base configuration for this SharePoint workspace
    context.subscriptions.push(vscode.commands.registerCommand('spgo.configureWorkspace', () => {

        const selectedResource = WorkspaceHelper.getActiveFile();

        const command : ICommand = new ConfigureWorkspaceCommand();
        command.execute(selectedResource);
    }));

    //add Copy URL Commands
    context.subscriptions.push(vscode.commands.registerCommand('spgo.copyRelativeUrl', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new CopySPUrlCommand();
        command.execute(selectedResource, false);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('spgo.copyAbsoluteUrl', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new CopySPUrlCommand();
        command.execute(selectedResource, true);
    }));

    //Delete the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.deleteFile', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new DeleteFileCommand();
        command.execute(selectedResource);
    }));

    //Discard the checkout of the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.discardCheckOut', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new DiscardCheckOutCommand();
        command.execute(selectedResource);
    }));

    //Delete the current file.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.getServerVersion', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new GetServerVersionCommand();
        command.execute(selectedResource);
    }));

    //Synchronize your local environment from the latest on the server.s
    // Uses the active document to determine the publishing workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.populateWorkspace', () => {

        const command : ICommand = new PopulateWorkspaceCommand();
        command.execute(null);
    }));

    //Synchronize your local environment from the latest on the server.
    // Uses the active document to determine the publishing workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishWorkspace', () => {

        const command : ICommand = new PublishWorkspaceCommand();
        command.execute(null);
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMajor', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new PublishFileCommand();
        command.execute(selectedResource, Constants.PUBLISHING_MAJOR);
    }));

    //Publish the current file to the server.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.publishMinor', (selectedResource?: Uri) => {

        selectedResource = selectedResource || WorkspaceHelper.getActiveFile();

        const command : ICommand = new PublishFileCommand();
        command.execute(selectedResource, Constants.PUBLISHING_MINOR);
    }));

    //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.reloadConfiguration', () => {

        WorkspaceHelper.getActiveWorkspaceUri()
            .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
            .then(() => Logger.updateStatusBar('Configuration file reloaded', 5))
            .catch(err => ErrorHelper.handleError(err));
    }));

    //Reset the current user's SharePoint credentials
    context.subscriptions.push(vscode.commands.registerCommand('spgo.resetCredentials', () => {

        const command : ICommand = new ResetCredentialsCommand();
        command.execute(null);
    }));

    //Download the contents of a SharePoint folder (and subfolders) to your local workspace.
    context.subscriptions.push(vscode.commands.registerCommand('spgo.retrieveFolder', () => {

        const command : ICommand = new RetrieveFolderCommand();
        command.execute(null);
    }));

    // autoPublish Feature
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) => {
        vscode.window.spgo.initialize(textDocument.uri)
            .then((config : IConfig) => {
                if (config) {
                    //is the file in the source folder? Save to the server.
                    if (textDocument.fileName.includes(config.sourceRoot) && Constants.PUBLISHING_NONE != config.publishingScope) {
                        if (Constants.PUBLISHING_MAJOR == config.publishingScope || Constants.PUBLISHING_MINOR == config.publishingScope) {

                            const command : ICommand = new PublishFileCommand();
                            command.execute(textDocument.uri, Constants.PUBLISHING_MINOR);
                        }
                        else {
                            const command : ICommand = new SaveFileCommand();
                            command.execute(textDocument.uri);
                        }
                    }
                    //is this an update to the config? Reload the config.
                    else if (textDocument.fileName.endsWith(path.sep + Constants.CONFIG_FILE_NAME)) {

                        vscode.window.spgo.reloadConfiguration(textDocument.uri);
                    }
                }
            });
    }));

    //get file info when the active text document changes.
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((textDocument: vscode.TextDocument) => {

        const selectedResource : Uri = textDocument.uri.scheme !== 'output' ? textDocument.uri : WorkspaceHelper.getActiveFile();

        // Only get file information for SP Files
        // VSCode will return '/' as the fsPath for the default 'welcome' page.
        if( selectedResource.fsPath !== path.sep){
            const command : ICommand = new GetCurrentFileInformationCommand();
            command.execute(selectedResource);
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
