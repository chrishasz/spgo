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

    public checkoutFile(textDocument: vscode.TextDocument) : Promise<any>{
        return new Promise((resolve, reject) => {
    
            let spr = RequestHelper.createRequest(vscode.window.spgo);
    
            let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
            
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/CheckOut()", {
                        body: {},
                        headers: {
                            'X-RequestDigest': digest,
                        }
                    });
                })
                .then(function(){ //response => {
                    Logger.outputMessage(`file ${textDocument.fileName} successfully checked out from server.`, vscode.window.spgo.outputChannel);
                    resolve(textDocument);
                }, err => {
                    reject(err);
                });
                
        });
    }
    
    public undoFileCheckout(textDocument: vscode.TextDocument) : Promise<vscode.TextDocument> {
        return new Promise((resolve, reject) => {
    
            let spr = RequestHelper.createRequest(vscode.window.spgo);
            
            let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
    
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/undocheckout()", {
                        body: {},
                        headers: {
                            'X-RequestDigest': digest,
                        }
                    });
                })
                .then(function(){ //response => {
                    Logger.outputMessage(`Discard check-out successful for file ${textDocument.fileName}.`, vscode.window.spgo.outputChannel);
                    resolve(textDocument);
                }, err => {
                    reject(err);
                });
        });
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


// export function downloadFiles(remoteFolder) : Promise<any>{

//     let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);

//     let context : any = {
//         siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
//         creds : RequestHelper.createCredentials(vscode.window.spgo)
//     };

//     let options : any = {
//         spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
//         spRootFolder : remoteFolder,
//         dlRootFolder: vscode.window.spgo.config.workspaceRoot
//     };

//     let fileGateway : SPFileGateway = new SPFileGateway();

//     return fileGateway.downloadFiles(remoteFolder, context, options );


    // return new Promise(function (resolve, reject) {
    //     let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);

    //     //format the remote folder to /<folder structure>/  
    //     remoteFolder = UrlHelper.formatFolder(remoteFolder);
        
    //     var context = {
    //         siteUrl : vscode.window.spgo.config.sharePointSiteUrl,
    //         creds : RequestHelper.createCredentials(vscode.window.spgo)
    //     };

    //     var options = {
    //         spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
    //         spRootFolder : remoteFolder,
    //         dlRootFolder: vscode.window.spgo.config.workspaceRoot
    //     };

    //     let fileGateway : SPFileGateWay = new SPFileGateway();

    //     fileGateway.
        
        // sppull(context, options)
        //     .then(function(downloadResults) {
        //         Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
        //         resolve();
        //     })
        //     .catch(function(err){
        //         //TODO: this is sorta hacky- Detect if this error was due to credentials - FATAL ERROR
        //         if(err.message.indexOf('wst:FailedAuthentication') > 0){
        //             vscode.window.spgo.credential = null;
        //             let error : IError ={
        //                 message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
        //             };
        //             Logger.outputError(error, vscode.window.spgo.outputChannel);
        //             reject();
        //         }
        //         //otherwise something else happened. - NON FATAL
        //         else{
        //             Logger.outputError(err, vscode.window.spgo.outputChannel);
        //             reject();
        //         }
        //     });
   // });
// }

// CheckOutType: Online = 0; Offline = 1; None = 2.
// all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
// export function getFileInformation(textDocument: vscode.TextDocument) : Promise<any>{
//     return new Promise(function (resolve, reject) {
        
//         let spr = RequestHelper.createRequest(vscode.window.spgo);

//         let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        
//         spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
//             .then(digest => {
//                 return spr.get(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/?$select=Name,ServerRelativeUrl,CheckOutType,TimeLastModified,CheckedOutByUser", {
//                     body: {},
//                     headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
//                 })
//                 .then( response => {
//                     let fileInfo : IFileInformation = {
//                         checkOutType : response.body.d.CheckOutType,
//                         checkOutBy : response.body.d.CheckedOutByUser,
//                         name : response.body.d.Name,
//                         timeLastModified : response.body.d.TimeLastModified
//                     }
//                     resolve(fileInfo);
//                 }, err => {
//                     Logger.outputError(err, vscode.window.spgo.outputChannel);
//                     reject(err);
//                 });
//             })
//     });
// }

// export function checkoutFile(textDocument: vscode.TextDocument) : Promise<any>{
//     return new Promise(function (resolve, reject) {

//         let spr = RequestHelper.createRequest(vscode.window.spgo);

//         let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);
        
//         spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
//             .then(digest => {
//                 return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/CheckOut()", {
//                     body: {},
//                     headers: {
//                         'X-RequestDigest': digest,
//                     }
//                 });
//             })
//             .then(function(){ //response => {
//                 Logger.outputMessage(`file ${textDocument.fileName} successfully checked out from server.`, vscode.window.spgo.outputChannel);
//                 resolve(textDocument);
//             }, err => {
//                 reject(err);
//             });
            
//     });
// }

// export function undoFileCheckout(textDocument: vscode.TextDocument) : Promise<vscode.TextDocument> {
//     return new Promise(function (resolve, reject) {

//         let spr = RequestHelper.createRequest(vscode.window.spgo);
        
//         let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fileName);

//         spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
//             .then(digest => {
//                 return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/undocheckout()", {
//                     body: {},
//                     headers: {
//                         'X-RequestDigest': digest,
//                     }
//                 });
//             })
//             .then(function(){ //response => {
//                 Logger.outputMessage(`Discard check-out successful for file ${textDocument.fileName}.`, vscode.window.spgo.outputChannel);
//                 resolve(textDocument);
//             }, err => {
//                 reject(err);
//             });
//     });
// }

// export function publishMajorFileVersion (textDocument: vscode.TextDocument) : Promise<any> {
//     return uploadFileToServer(textDocument, Constants.PUBLISHING_MAJOR);
// }

// export function publishMinorFileVersion (textDocument: vscode.TextDocument) : Promise<any> {
//     return uploadFileToServer(textDocument, Constants.PUBLISHING_MINOR);
// }

// export function uploadFileToServer(textDocument: vscode.TextDocument, publishingScope? : string) : Promise<any> { 
//     return new Promise(function (resolve, reject) {
//         if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
//             let relativeFilePath = textDocument.fileName.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
//             let remoteFolder = relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
//             let remoteFileName = relativeFilePath.substring(relativeFilePath.lastIndexOf(path.sep)+1);

//             publishingScope = publishingScope || vscode.window.spgo.config.publishingScope;

//             var coreOptions = buildCoreUploadOptions(publishingScope);
            
//             var credentials = RequestHelper.createCredentials(vscode.window.spgo);

//             var fileOptions = {
//                 folder: remoteFolder,
//                 fileName: remoteFileName,
//                 fileContent: textDocument.getText()
//             };


//             spsave(coreOptions, credentials, fileOptions)
//                 .then(function(){
//                     Logger.outputMessage(`file ${textDocument.fileName} successfully saved to server.`, vscode.window.spgo.outputChannel);
//                     resolve(textDocument);
//                 })
//                 .catch(function(err){
//                     //TODO: this is sorta hacky- Detect if this error was due to credentials
//                     if(err.message.indexOf('wst:FailedAuthentication') > 0){
//                         vscode.window.spgo.credential = null;
//                         let error : IError ={
//                             message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
//                         };
//                         Logger.outputError(error, vscode.window.spgo.outputChannel);
//                     }
//                     //otherwise something else happened.
//                     else{
//                         Logger.outputError(err, vscode.window.spgo.outputChannel);
//                     }
//                     reject(err);
//                 });
//         }
//         else{
//             vscode.window.spgo.credential = null;
//             let error : IError ={
//                 message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
//             };
//             Logger.outputError(error, vscode.window.spgo.outputChannel);
//         }
            
//     });
// }

// export function uploadWorkspaceToServer(publishingScope? : string) : Promise<vscode.TextDocument> {
//     return new Promise(function (resolve, reject) {
//         if(vscode.window.spgo.credential.username && vscode.window.spgo.credential.password){
//             let localFilePath = vscode.window.spgo.config.workspaceRoot;

//             //TODO: Do we want to allow users to specify this setting?
//             publishingScope = publishingScope || Constants.PUBLISHING_MAJOR;

//             var coreOptions = buildCoreUploadOptions(publishingScope);
            
//             var credentials = RequestHelper.createCredentials(vscode.window.spgo);

//             var fileOptions = {
//                 glob : localFilePath + '/**/*.*',
//                 base : localFilePath,
//                 folder: '/'
//             };

//             spsave(coreOptions, credentials, fileOptions)
//                 .then(function(){
//                     Logger.outputMessage('Workspace Publish complete.', vscode.window.spgo.outputChannel);
//                     resolve();
//                 })
//                 .catch(function(err){
//                     //TODO: this is sorta hacky- Detect if this error was due to credentials
//                     if(err.message.indexOf('wst:FailedAuthentication') > 0){
//                         vscode.window.spgo.credential = null;
//                         let error : IError ={
//                             message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
//                         };
//                         Logger.outputError(error, vscode.window.spgo.outputChannel);
//                         reject(err);
//                     }
//                     //otherwise something else happened.
//                     else{
//                         Logger.outputError(err, vscode.window.spgo.outputChannel);
//                         reject(err);
//                     }
//                 });
//         }
//         else{
//             vscode.window.spgo.credential = null;
//             let error : IError ={
//                 message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
//             };
//             Logger.outputError(error, vscode.window.spgo.outputChannel);
//         }
//     });
// }

// export function buildCoreUploadOptions(publishingScope) : any {
//     var coreOptions = {
//         siteUrl: vscode.window.spgo.config.sharePointSiteUrl,
//         checkinMessage : 'Updated by SPGo',
//         checkin : false
//     };

//     if(publishingScope === Constants.PUBLISHING_MAJOR){
//         coreOptions.checkin = true;
//         _.extend(coreOptions,  {checkinType : 1});
//     }
//     else if(publishingScope === Constants.PUBLISHING_MINOR){
//         coreOptions.checkin = true;
//         _.extend(coreOptions,  {checkinType : 0});
//     }

//     return coreOptions;
// }
