'use strict';

import { Uri } from 'vscode';
import * as vscode from 'vscode';

declare module 'vscode' {
    export namespace window {
         export let spgo: IAppManager;
    }
}

export interface IAppManager{  
    credentials? : ICredential;
    configSet? : Map<string, IConfig>; //TODO: Reenable this if you need performance optimization.
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;

    initialize(contextPath : Uri) : Promise<any>;
}

export interface ICredential{
    domain? : string;
    password? : string;
    username? : string;
}

export interface IConfig{
    authenticationType? : string;
    authenticationDetails? : any;
    checkInMessage? : string,
    publishingScope? : string;
    publishWorkspaceGlobPattern? : string;
    remoteFolders? : string[];
    sharePointSiteUrl? : string;
    sourceDirectory? : string;      // The relative directory structure underneath the VSCode local workspace root directory
    storeCredentials? : Boolean;
    subSites? : ISubSite[];
    workspaceRoot? : string;        // (internal) The full path to the local workspace root (VS Workspace root + sourceDirectory)
}

export interface IError {
    message: string;
}

export interface IPublishingAction{
    contentUri: string;
    scope : string;
    message : string;
}

export interface ISPFileInformation{
    checkOutType : number;
    checkOutBy? : string;
    name : string;
    timeLastModified : Date;
}

export interface ISubSite {
    remoteFolders? : string[];
    sharePointSiteUrl : string;
}
