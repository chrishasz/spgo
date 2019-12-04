'use strict';

import * as vscode from 'vscode';
import {ISPRequest, IAuthOptions} from 'sp-request';

import { Uri } from 'vscode';
import { ISPPullOptions } from 'sppull';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ICoreOptions, FileOptions } from 'spsave';
import { IPublishingAction, IConfig } from '../spgo';
import { RequestHelper } from '../util/requestHelper';
import { SPFileGateway } from '../gateway/spFileGateway';
import { DownloadFileOptionsFactory } from '../factory/downloadFileOptionsFactory';

export class SPFileService{

    _config : IConfig;
    _fileGateway : SPFileGateway;

    constructor (config : IConfig){
        this._config = config;
        this._fileGateway = new SPFileGateway(config);
    }

    public checkOutFile(textDocument: vscode.TextDocument) : Promise<any>{

        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);       
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName, this._config);
        
        return this._fileGateway.checkOutFile(fileUri, spr);
    }

    public deleteFileFromServer(fileUri: vscode.Uri) : Promise<any> {
        
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);       
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(fileUri.fsPath, this._config);
        
        return this._fileGateway.deleteFile(remoteFileUri, spr);
    }

    public downloadFiles(siteUrl: vscode.Uri, remoteFolder : string) : Promise<any>{
        //format the remote folder to /<folder structure>/  
        remoteFolder = UrlHelper.ensureLeadingWebSlash(remoteFolder);
        let factory : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(remoteFolder);
    
        let context : any = {
            siteUrl : siteUrl.toString(),
            creds : RequestHelper.createCredentials(vscode.window.spgo, this._config)
        };
    
        let options : ISPPullOptions = factory.createFileOptions(siteUrl, this._config);
        let localFolder : string = options.dlRootFolder + FileHelper.convertToForwardSlash(options.spRootFolder);

        return this._fileGateway.downloadFiles(localFolder, context, options);
    }

    public downloadFileMajorVersion(filePath : vscode.Uri, downloadFilePath? : string) : Promise<any>{
        let remoteFolder : string = FileHelper.getFolderFromPath(filePath, this._config);
        let sharePointSiteUrl : Uri = Uri.parse(this._config.sharePointSiteUrl);
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        
        let context : any = {
            siteUrl : this._config.sharePointSiteUrl,
            creds : RequestHelper.createCredentials(vscode.window.spgo, this._config)
        };
    
        let options : any = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
            spRootFolder : remoteFolder,
            strictObjects: [fileUri.path],
            dlRootFolder: downloadFilePath
        };
        let localFolder : string = options.dlRootFolder + FileHelper.convertToForwardSlash(options.spRootFolder);

        return this._fileGateway.downloadFiles(localFolder, context, options);
    }

    // CheckOutType: Online = 0; Offline = 1; None = 2.
    // all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
    public getFileInformation(textDocument: vscode.TextDocument) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);
        
        Logger.outputMessage(`Getting file information for:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        
        return this._fileGateway.getFileInformation(fileUri, spr);
    }

    public checkoutFile(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);
        
        Logger.outputMessage(`Checking out File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);
        
        return this._fileGateway.checkOutFile(fileUri, spr);
    }
    
    public undoFileCheckout(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);
        
        Logger.outputMessage(`Discarding Check out for File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.undoCheckOutFile(fileUri, spr);
    }
    
    public uploadFilesToServer(publishingInfo : IPublishingAction) : Promise<vscode.TextDocument> {
        let localFilePath : string = this._config.workspaceRoot;
        let coreOptions : ICoreOptions = this.buildCoreUploadOptions(publishingInfo);
        var credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo, this._config);
        var fileOptions : FileOptions = {
            glob : publishingInfo.contentUri,
            base : localFilePath,
            folder: '/'
        };
        
        Logger.outputMessage(`Saving file:  ${publishingInfo.contentUri}`, vscode.window.spgo.outputChannel);
        
        return this._fileGateway.uploadFiles(coreOptions, credentials, fileOptions);
    }

    private buildCoreUploadOptions(publishingInfo : IPublishingAction) : any {
        var coreOptions = {
            siteUrl: this._config.sharePointSiteUrl,
            checkinMessage : encodeURI(publishingInfo.message),
            checkin : false
        };
    
        if(publishingInfo.scope === Constants.PUBLISHING_MAJOR){
            coreOptions.checkin = true;
            coreOptions['checkinType'] = 1;
        }
        else if(publishingInfo.scope === Constants.PUBLISHING_MINOR){
            coreOptions.checkin = true;
            coreOptions['checkinType'] = 0;
        }
    
        return coreOptions;
    }
}