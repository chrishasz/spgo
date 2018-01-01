'use strict';

// import * as path from 'path';
import * as _ from 'lodash'; 
import * as vscode from 'vscode';
import {ISPRequest} from 'sp-request';

import Uri from 'vscode-uri'
import {spsave} from 'spsave';
import {Logger} from '../util/logger';
import {Constants} from './../constants';
import {UrlHelper} from './../util/UrlHelper';
import {FileHelper} from './../util/fileHelper';
import {ErrorHelper} from './../util/errorHelper';
import {RequestHelper} from './../util/requestHelper'
import {SPFileGateway} from './../gateway/spFileGateway';

export class SPFileService{
    constructor (){

    }

    public checkOutFile(textDocument: vscode.TextDocument) : Promise<any>{

        let spr = RequestHelper.createRequest(vscode.window.spgo);       
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        
        return fileGateway.checkOutFile(fileUri, spr);
    }

    public downloadFile(filePath : vscode.Uri, downloadFilePath? : string) : Promise<any>{
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

    public downloadFiles(remoteFolder) : Promise<any>{
        //format the remote folder to /<folder structure>/  
        remoteFolder = UrlHelper.formatFolder(remoteFolder);
        let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
    
        let context : any = {
            siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
            creds : RequestHelper.createCredentials(vscode.window.spgo)
        };
    
        let options : any = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
            spRootFolder : remoteFolder,
            dlRootFolder: vscode.window.spgo.config.workspaceRoot
        };
    
        let fileGateway : SPFileGateway = new SPFileGateway();

        //TODO: come up with a more consistent solution for setting headers
        if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
            RequestHelper.setNtlmHeader();
        }

        return fileGateway.downloadFiles(remoteFolder, context, options);
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
    
    public uploadFileToServer(filePath: vscode.Uri, publishingScope? : string) : Promise<any> { 
        return new Promise((resolve, reject) => {
            let localFilePath = vscode.window.spgo.config.workspaceRoot;
            
            publishingScope = publishingScope || vscode.window.spgo.config.publishingScope;

            let coreOptions : any = this.buildCoreUploadOptions(publishingScope);
            
            var credentials = RequestHelper.createCredentials(vscode.window.spgo);

            var fileOptions = {
                glob : filePath.fsPath,
                base : localFilePath,
                folder: '/'
            };

            //ToDo: come up with a more consistent solution for setting headers
            if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
                RequestHelper.setNtlmHeader();
            }

            spsave(coreOptions, credentials, fileOptions)
                .then(function(response){
                    Logger.outputMessage(`file ${filePath.fsPath} successfully saved to server.`, vscode.window.spgo.outputChannel);
                    resolve(response);
                })
                .catch((err) => ErrorHelper.handleHttpError(err, reject));
        });
    }

    public uploadWorkspaceToServer(publishingScope? : string) : Promise<vscode.TextDocument> {
        return new Promise((resolve, reject) => {
            let localFilePath = vscode.window.spgo.config.workspaceRoot;
            
            publishingScope = publishingScope || Constants.PUBLISHING_MAJOR;

            var coreOptions = this.buildCoreUploadOptions(publishingScope);
            
            var credentials = RequestHelper.createCredentials(vscode.window.spgo);

            var fileOptions = {
                glob : localFilePath + '/**/*.*',
                base : localFilePath,
                folder: '/'
            };

            //TODO: come up with a more consistent solution for setting headers
            if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
                RequestHelper.setNtlmHeader();
            }

            spsave(coreOptions, credentials, fileOptions)
                .then((response) => {
                    Logger.outputMessage('Workspace Publish complete.', vscode.window.spgo.outputChannel);
                    resolve(response);
                })
                .catch((err) => ErrorHelper.handleHttpError(err, reject));
        });
    }

    private buildCoreUploadOptions(publishingScope : string) : any {
        var coreOptions = {
            siteUrl: vscode.window.spgo.config.sharePointSiteUrl,
            checkinMessage : 'Updated by SPGo',
            checkin : false
        };
    
        if(publishingScope === Constants.PUBLISHING_MAJOR){
            coreOptions.checkin = true;
            _.extend(coreOptions,  {checkinType : 1});
        }
        else if(publishingScope === Constants.PUBLISHING_MINOR){
            coreOptions.checkin = true;
            _.extend(coreOptions,  {checkinType : 0});
        }
    
        return coreOptions;
    }
}