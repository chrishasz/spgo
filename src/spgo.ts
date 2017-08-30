import * as vscode from 'vscode';

declare module 'vscode' {
    export namespace window {
         export let spgo: IAppManager;
    }
}

export interface IAppManager{  
    credential? : ICredential;
    config? : IConfig;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;
}

export interface ICredential{
    username? : string;
    password? : string;
}

interface ICommandBase {

}

export interface ICommand{
    new() : ICommandBase;
    activate(...parameters) : void;
}

export interface IConfig{
    remoteFolders? : string[];
    publishingScope? : string;
    browser? : string;
    pollTimeout? : number;
    sharePointSiteUrl? : string;
    sourceDirectory? : string;      //The relative directory structure underneath the VSCode local workspace root directory
    workspaceRoot? : string;        //The full path to the local workspace root (VS Workspace root + sourceDirectory)
}

export interface IError {
    message: string;
}