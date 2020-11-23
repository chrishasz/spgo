'use strict';

import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { ICoreOptions, FileOptions } from 'spsave';
import { ISPRequest, IAuthOptions } from 'sp-request';
import { ISPPullContext, ISPPullOptions } from 'sppull';
import { LocalStorageService } from './service/localStorageService';

declare module 'vscode' {
    export namespace window {
         export let spgo: IAppManager;
    }
}

export interface IAppManager{  
    credentials? : ICredential;
    configSet? : Map<string, IConfig>;
    localStore : LocalStorageService;
    outputChannel: vscode.OutputChannel;
    statusBarItem: vscode.StatusBarItem;

    initialize(contextPath : Uri) : Promise<any>;
    reloadConfiguration(workspaceFolder : Uri) : void;
}

export interface ICredential{
    //username/Password
    domain? : string;
    password? : string;
    username? : string;

    //Addin Only
    clientId? : string;
    clientSecret? : string;
    realm? : string;
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

export interface IFileGateway {
    checkOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>;
    deleteFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>;
    downloadFiles(localFolder: string, context : ISPPullContext, fileOptions : ISPPullOptions) : Promise<any>;
    getFileInformation( fileUri : Uri, spr : ISPRequest ) : Promise<any>;
    undoCheckOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>;
    uploadFiles(coreOptions : ICoreOptions, credentials : IAuthOptions, fileOptions : FileOptions) : Promise<any>;
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
