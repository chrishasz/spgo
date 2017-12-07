'use strict';
//var sppull = require("sppull").sppull;
import * as path from 'path';
import * as _ from 'lodash'; 
import * as vscode from 'vscode';
import {ISPRequest} from 'sp-request';

import Uri from 'vscode-uri'
import {spsave} from 'spsave';
import { IError } from './../spgo';
import {SPFileGateway} from './../gateway/spFileGateway';
import {Logger} from '../util/logger';
import Constants from './../constants';
import {UrlHelper} from './../util/UrlHelper';
import {RequestHelper} from './../util/requestHelper'



export class SPFileService{
    constructor (){

    }

    public checkOutFile(textDocument: vscode.TextDocument) : Promise<any>{

        let spr = RequestHelper.createRequest(vscode.window.spgo);       
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        
        return fileGateway.checkOutFile(fileUri, spr);
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

        //ToDo: come up with a more consistent solution for setting headers
        if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
            RequestHelper.setNtlmHeader();
        }

        return fileGateway.downloadFiles(remoteFolder, context, options);
    }

    // CheckOutType: Online = 0; Offline = 1; None = 2.
    // all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
    public getFileInformation(textDocument: vscode.TextDocument) : Promise<any>{

        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.getFileInformation(fileUri, spr);
    }

    public publishMajorFileVersion (textDocument: vscode.TextDocument) : Promise<any> {
        return this.uploadFileToServer(textDocument, Constants.PUBLISHING_MAJOR);
    }
    
    public publishMinorFileVersion (textDocument: vscode.TextDocument) : Promise<any> {
        return this.uploadFileToServer(textDocument, Constants.PUBLISHING_MINOR);
    }

    public checkoutFile(textDocument: vscode.TextDocument) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.checkOutFile(fileUri, spr);
    }
    
    public undoFileCheckout(textDocument: vscode.TextDocument) : Promise<vscode.TextDocument> {
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        let fileGateway : SPFileGateway = new SPFileGateway();
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo);
        
        return fileGateway.undoCheckOutFile(fileUri, spr);
    }
    
    public uploadFileToServer(textDocument: vscode.TextDocument, publishingScope? : string) : Promise<any> { 
        return new Promise((resolve, reject) => {
            if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
                let relativeFilePath = textDocument.fileName.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
                let remoteFolder = relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
                let remoteFileName = relativeFilePath.substring(relativeFilePath.lastIndexOf(path.sep)+1);
    
                publishingScope = publishingScope || vscode.window.spgo.config.publishingScope;
    
                let coreOptions : any = this.buildCoreUploadOptions(publishingScope);
                
                var credentials = RequestHelper.createCredentials(vscode.window.spgo);
    
                var fileOptions = {
                    folder: remoteFolder,
                    fileName: remoteFileName,
                    fileContent: textDocument.getText()
                };
    
                //ToDo: come up with a more consistent solution for setting headers
                if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
                    RequestHelper.setNtlmHeader();
                }
    
                spsave(coreOptions, credentials, fileOptions)
                    .then(function(){
                        Logger.outputMessage(`file ${textDocument.fileName} successfully saved to server.`, vscode.window.spgo.outputChannel);
                        resolve(textDocument);
                    })
                    .catch(function(err){
                        //TODO: this is sorta hacky- Detect if this error was due to credentials
                        if(err.message.indexOf('wst:FailedAuthentication') > 0){
                            vscode.window.spgo.credential = null;
                            let error : IError ={
                                message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                            };
                            Logger.outputError(error, vscode.window.spgo.outputChannel);
                        }
                        //otherwise something else happened.
                        else{
                            Logger.outputError(err, vscode.window.spgo.outputChannel);
                        }
                        reject(err);
                    });
            }
            else{
                vscode.window.spgo.credential = null;
                let error : IError ={
                    message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                };
                Logger.outputError(error, vscode.window.spgo.outputChannel);
            }
                
        });
    }

    public uploadWorkspaceToServer(publishingScope? : string) : Promise<vscode.TextDocument> {
        return new Promise((resolve, reject) => {
            if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
                let localFilePath = vscode.window.spgo.config.workspaceRoot;
    
                //TODO: Do we want to allow users to specify this setting?
                publishingScope = publishingScope || Constants.PUBLISHING_MAJOR;
    
                var coreOptions = this.buildCoreUploadOptions(publishingScope);
                
                var credentials = RequestHelper.createCredentials(vscode.window.spgo);
    
                var fileOptions = {
                    glob : localFilePath + '/**/*.*',
                    base : localFilePath,
                    folder: '/'
                };

                //ToDo: come up with a more consistent solution for setting headers
                if( Constants.SECURITY_NTLM == vscode.window.spgo.config.authenticationType){
                    RequestHelper.setNtlmHeader();
                }
    
                spsave(coreOptions, credentials, fileOptions)
                    .then(() => {
                        Logger.outputMessage('Workspace Publish complete.', vscode.window.spgo.outputChannel);
                        resolve();
                    })
                    .catch( (err)=> {
                        //TODO: this is sorta hacky- Detect if this error was due to credentials
                        if(err.message.indexOf('wst:FailedAuthentication') > 0){
                            vscode.window.spgo.credential = null;
                            let error : IError ={
                                message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                            };
                            Logger.outputError(error, vscode.window.spgo.outputChannel);
                            reject(err);
                        }
                        //otherwise something else happened.
                        else{
                            Logger.outputError(err, vscode.window.spgo.outputChannel);
                            reject(err);
                        }
                    });
            }
            else{
                vscode.window.spgo.credential = null;
                let error : IError ={
                    message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                };
                Logger.outputError(error, vscode.window.spgo.outputChannel);
            }
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