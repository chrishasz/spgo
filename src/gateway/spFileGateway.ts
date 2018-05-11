'use strict';
var sppull = require("sppull").sppull;

import Uri from 'vscode-uri';
import * as vscode from 'vscode';
import {ISPRequest} from 'sp-request';

import {ISPFileInformation} from './../spgo'
import {Logger} from '../util/logger';
import {RequestHelper} from './../util/requestHelper';

export class SPFileGateway{

    constructor(){

    }

    public checkOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise(function (resolve, reject) {
            
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/CheckOut()", {
                        body: {},
                        headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
                    });
                })
                .then( (response) => {
                    resolve(response);
                })
                .catch((err) => reject(err));
                // .catch((err) => ErrorHelper.handleError(err, reject));
        });
    }

    public downloadFile(context : any, fileOptions : any) : Promise<any>{
        return new Promise(function (resolve, reject) {
            
            sppull(context, fileOptions)
                .then(function(downloadResults) {
                    if( fileOptions.strictObjects && fileOptions.strictObjects.length > 0){
                        Logger.outputMessage(`Successfully downloaded ${fileOptions.strictObjects[0]} files to: ${fileOptions.dlRootFolder}`, vscode.window.spgo.outputChannel);
                    }
                    resolve(downloadResults);
                })
                .catch((err) => reject(err));
                // .catch((err) => ErrorHelper.handleError(err, reject));
        });
    }

    public downloadFiles(remoteFolder: string, context : any, fileOptions : any) : Promise<any>{
        return new Promise(function (resolve, reject) {
            
            sppull(context, fileOptions)
                .then(function(downloadResults) {
                    Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
                    resolve(downloadResults);
                })
                .catch((err) => reject(err));
                // .catch((err) => ErrorHelper.handleError(err, reject));
        });
    }

    public getFileInformation( fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise(function (resolve, reject) {
                        
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.get(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/?$select=Name,ServerRelativeUrl,CheckOutType,TimeLastModified,CheckedOutByUser", {
                        body: {},
                        headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
                    })
                    .then( response => {
                        let fileInfo : ISPFileInformation = {
                            checkOutType : response.body.d.CheckOutType,
                            name : response.body.d.Name,
                            timeLastModified : response.body.d.TimeLastModified
                        }

                        if( fileInfo.checkOutType == 0){
                            // '/_api/web/getfilebyserverrelativeurl(\'' + encodeURI(fileName) + '\')/Checkedoutbyuser?$select=Title,Email';
                            spr.get(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/CheckedOutByUser?$select=Title,Email", {
                                body: {},
                                headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
                            }).then( userInfo => {
                                fileInfo.checkOutBy = userInfo.body.d.Title;
                                resolve(fileInfo);
                            });
                        }
                        else{
                            resolve(fileInfo);
                        }
                    })
                    .catch((err) => reject(err));
                    // .catch((err) => ErrorHelper.handleErrorSilently(err, reject));
                })
        });
    }

    public undoCheckOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise((resolve, reject) => {            
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/undocheckout()", {
                        body: {},
                        headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
                    });
                })
                .then(function(){
                    resolve();
                })
                .catch((err) => reject(err));
                // .catch((err) => ErrorHelper.handleError(err, reject));
        });
    }
}