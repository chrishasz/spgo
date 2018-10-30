'use strict';
var sppull = require("sppull").sppull;

import Uri from 'vscode-uri';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {ISPFileInformation} from './../spgo'
import {ISPRequest, IAuthOptions} from 'sp-request';
import {RequestHelper} from './../util/requestHelper';
import {ISPPullContext, ISPPullOptions} from 'sppull';
import {spsave, ICoreOptions, FileOptions} from 'spsave';

export class SPFileGateway{

    constructor(){}

    public checkOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise((resolve, reject) => {
            
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/CheckOut()", {
                        body: {},
                        headers: RequestHelper.createAuthHeaders(vscode.window.spgo, digest)
                    });
                })
                .then( (response) => {
                    resolve(response);
                })
                .catch((err) => reject(err));
        });
    }

    public deleteFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise((resolve, reject) => {
            
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')", {
                        body: {},
                        headers: RequestHelper.createAuthHeaders(vscode.window.spgo, digest, {
                            'X-HTTP-Method':'DELETE',
                            'accept': 'application/json; odata=verbose',
                            'content-type': 'application/json; odata=verbose'
                        })
                    });
                })
                .then( (response) => {
                    resolve(response);
                })
                .catch((err) => reject(err));

            // sppurge(credentials, fileOptions)
            //     .then(function(response){
            //         Logger.outputMessage(`file ${fileOptions.filePath} successfully deleted from server.`, vscode.window.spgo.outputChannel);
            //         resolve(response);
            //     })
            //     .catch((err) => reject(err));
        });
    }

    public downloadFile(context : ISPPullContext, fileOptions : ISPPullOptions) : Promise<any>{
            
        return RequestHelper.setNtlmHeader()
            .then(()=>{
                return new Promise((resolve,reject) => {
                    sppull(context, fileOptions)
                        .then((downloadResults : Array<any>) => {
                            if( fileOptions.strictObjects && fileOptions.strictObjects.length > 0){
                                Logger.outputMessage(`Successfully downloaded ${fileOptions.strictObjects[0]} files to: ${fileOptions.dlRootFolder}`, vscode.window.spgo.outputChannel);
                            }
                            resolve(downloadResults);
                        })
                        .catch((err) => reject(err));
                });
            });
    }

    public downloadFiles(remoteFolder: string, context : any, fileOptions : ISPPullOptions) : Promise<any>{

        return RequestHelper.setNtlmHeader()
            .then(()=>{
                return new Promise((resolve,reject) => {
                    sppull(context, fileOptions)
                        .then((downloadResults : Array<any>) => {
                            Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
                            resolve(downloadResults);
                        })
                        .catch((err) => reject(err));
                });
            });
    }

    public getFileInformation( fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise((resolve, reject) => {
                        
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.get(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/?$select=Name,ServerRelativeUrl,CheckOutType,TimeLastModified,CheckedOutByUser", {
                        body: {},
                        headers: RequestHelper.createAuthHeaders(vscode.window.spgo, digest)
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
                                headers: RequestHelper.createAuthHeaders(vscode.window.spgo, digest)
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
                })
                .catch((err) => reject(err));
        })
    }

    public undoCheckOutFile(fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise((resolve, reject) => {    

            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.post(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/undocheckout()", {
                        body: {},
                        headers: RequestHelper.createAuthHeaders(vscode.window.spgo, digest)
                    });
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }

    public uploadFiles(coreOptions : ICoreOptions, credentials : IAuthOptions, fileOptions : FileOptions) : Promise<any>{
        return RequestHelper.setNtlmHeader()
            .then(()=>{
                return new Promise((resolve,reject) => {
                    spsave(coreOptions, credentials, fileOptions)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((err) => reject(err));
                });
            });
    }
}