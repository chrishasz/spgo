'use strict';

import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { LocalStorageService } from './service/localStorageService';

declare module 'vscode' {
    export namespace window {
         export let spgo: IAppManager;
    }
}

export interface IAppManager{  
    credentials? : ICredential;
    configSet? : Map<string, IConfig>; //TODO: Reenable this if you need performance optimization.
    localStore : LocalStorageService;
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
    publishWorkspaceOptions? : IPublishWorkspaceOptions;
    publishWorkspaceGlobPattern? : string;
    remoteFolders? : string[];
    sharePointSiteUrl? : string;
    sourceDirectory? : string;      // The relative directory structure underneath the VSCode local workspace root directory
    sourceRoot? : string;           // (internal) The full path to the local source directory root (VS Workspace root + sourceDirectory)
    storeCredentials? : Boolean;
    subSites? : ISubSite[];
    workspaceRoot? : string;        // (internal) The full path to the local workspace root (VS Workspace root)
}

export interface IError {
    message: string;
}

export interface IPublishingAction{
    contentUri : string;
    scope : string;
    message : string;
}

export interface IPublishWorkspaceOptions{
    destinationFolder? : string;
    globPattern? : string;
    localRoot? : string;
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
