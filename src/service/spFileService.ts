'use strict';

import * as vscode from 'vscode';
import {ISPRequest, IAuthOptions} from 'sp-request';

import Uri from 'vscode-uri'
import {ISPPullOptions} from 'sppull';
import {Constants} from './../constants';
import {IPublishingAction} from '../spgo';
import {UrlHelper} from './../util/urlHelper';
import {FileHelper} from './../util/fileHelper';
import {RequestHelper} from './../util/requestHelper'
import {SPFileGateway} from './../gateway/spFileGateway';
import { DownloadFileOptionsFactory } from '../factory/downloadFileOptionsFactory';
import { ICoreOptions, FileOptions } from 'spsave';
import { Logger } from '../util/logger';

export class SPFileService{

    _fileGateway : SPFileGateway;

    constructor (){
        this._fileGateway = new SPFileGateway();
    }

    public checkOutFile(textDocument: vscode.TextDocument) : Promise<any>{

        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);       
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        
        return this._fileGateway.checkOutFile(fileUri, spr);
    }

    public deleteFileFromServer(fileUri: vscode.Uri) : Promise<any> {
        
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);       
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(fileUri.fsPath);
        
        return this._fileGateway.deleteFile(remoteFileUri, spr);
    }

    public downloadFiles(remoteFolder : string) : Promise<any>{
        //format the remote folder to /<folder structure>/  
        remoteFolder = UrlHelper.ensureLeadingWebSlash(remoteFolder);
        let factory : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(remoteFolder);
    
        let context : any = {
            siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
            creds : RequestHelper.createCredentials(vscode.window.spgo)
        };
    
        let options : ISPPullOptions = factory.createFileOptions();

        return this._fileGateway.downloadFiles(options.spDocLibUrl || options.spRootFolder, context, options);
    }

    public downloadFileMajorVersion(filePath : vscode.Uri, downloadFilePath? : string) : Promise<any>{
        let remoteFolder : string = FileHelper.getFolderFromPath(filePath.fsPath);
        let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath);
        
        let context : any = {
            siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
            creds : RequestHelper.createCredentials(vscode.window.spgo)
        };
    
        let options : any = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
            spRootFolder : remoteFolder,
            strictObjects: [fileUri.path],
            dlRootFolder: downloadFilePath
        };

        return this._fileGateway.downloadFiles(options.spDocLibUrl || options.spRootFolder, context, options);
    }

    // CheckOutType: Online = 0; Offline = 1; None = 2.
    // all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
    public getFileInformation(textDocument: vscode.TextDocument) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        Logger.outputMessage(`Getting file information for:  ${textDocument.fileName}`, vscode.window.spgo.outputChannel);
        
        return this._fileGateway.getFileInformation(fileUri, spr);
    }

    public checkoutFile(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        Logger.outputMessage(`Checking out File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);
        
        return this._fileGateway.checkOutFile(fileUri, spr);
    }
    
    public undoFileCheckout(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        Logger.outputMessage(`Discarding Check out for File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.undoCheckOutFile(fileUri, spr);
    }
    
    public uploadFilesToServer(publishingInfo : IPublishingAction) : Promise<vscode.TextDocument> {
        let localFilePath : string = vscode.window.spgo.config.workspaceRoot;
        let coreOptions : ICoreOptions = this.buildCoreUploadOptions(publishingInfo);
        var credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo);
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
            siteUrl: vscode.window.spgo.config.sharePointSiteUrl,
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