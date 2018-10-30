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

export class SPFileService{
    constructor (){}

    public checkOutFile(textDocument: vscode.TextDocument) : Promise<any>{

        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);       
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        
        return fileGateway.checkOutFile(fileUri, spr);
    }

    public deleteFileFromServer(fileUri: vscode.Uri) : Promise<any> {
        
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);       
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(fileUri.fsPath);
        let fileGateway : SPFileGateway = new SPFileGateway();
        
        return fileGateway.deleteFile(remoteFileUri, spr);
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
    
        let fileGateway : SPFileGateway = new SPFileGateway();

        return fileGateway.downloadFiles(options.spDocLibUrl || options.spRootFolder, context, options);
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
        let fileGateway : SPFileGateway = new SPFileGateway();

        return fileGateway.downloadFile(context, options);
    }

    // CheckOutType: Online = 0; Offline = 1; None = 2.
    // all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
    public getFileInformation(textDocument: vscode.TextDocument) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.getFileInformation(fileUri, spr);
    }

    public checkoutFile(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.checkOutFile(fileUri, spr);
    }
    
    public undoFileCheckout(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.undoCheckOutFile(fileUri, spr);
    }
    
    // public uploadFileToServer(publishingInfo: IPublishingAction, publishingScope? : string) : Promise<any> { 
    //     let fileGateway : SPFileGateway = new SPFileGateway();
    //     let localFilePath : string = vscode.window.spgo.config.workspaceRoot;
    //     let coreOptions : ICoreOptions = this.buildCoreUploadOptions(publishingInfo);
    //     var credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo);
    //     var fileOptions : FileOptions = {
    //         glob : publishingInfo.contentUri,
    //         base : localFilePath,
    //         folder: '/'
    //     };

    //     return fileGateway.uploadFiles(coreOptions, credentials, fileOptions);
    // }

    public uploadFilesToServer(publishingInfo : IPublishingAction) : Promise<vscode.TextDocument> { 
        let fileGateway : SPFileGateway = new SPFileGateway();
        let localFilePath : string = vscode.window.spgo.config.workspaceRoot;
        let coreOptions : ICoreOptions = this.buildCoreUploadOptions(publishingInfo);
        var credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo);
        var fileOptions : FileOptions = {
            glob : publishingInfo.contentUri,
            base : localFilePath,
            folder: '/'
        };

        return fileGateway.uploadFiles(coreOptions, credentials, fileOptions);
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