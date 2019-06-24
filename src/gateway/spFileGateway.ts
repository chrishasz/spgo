'use strict';

var SPPull = require("sppull");

import Uri from 'vscode-uri';
import * as vscode from 'vscode';
//import * as sppull from 'sppull';

import {Logger} from '../util/logger';
import {ISPFileInformation} from '../spgo'
import {RequestHelper} from '../util/requestHelper';
import {ISPRequest, IAuthOptions} from 'sp-request';
import {spsave, ICoreOptions, FileOptions} from 'spsave';
import { ISPPullContext, ISPPullOptions} from 'sppull';

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
                .catch((err : any) => reject(err));
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
                .catch((err : any) => reject(err));

            // sppurge(credentials, fileOptions)
            //     .then(function(response){
            //         Logger.outputMessage(`file ${fileOptions.filePath} successfully deleted from server.`, vscode.window.spgo.outputChannel);
            //         resolve(response);
            //     })
            //     .catch((err) => reject(err));
        });
    }

    public downloadFiles(remoteFolder: string, context : ISPPullContext, fileOptions : ISPPullOptions) : Promise<any>{

        return RequestHelper.setNtlmHeader()
            .then(()=>{
                return new Promise((resolve,reject) => {

                    SPPull.sppull(context, fileOptions)
                        .then((downloadResults : Array<any>) => {
                            Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
                            resolve(downloadResults);
                        })
                        .catch((err : any) => reject(err));
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
                            // '/_api/web/getFileByServerRelativeUrl(\'' + encodeURI(fileName) + '\')/CheckedOutByUser?$select=Title,Email';
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
                    .catch((err : any) => reject(err));
                })
                .catch((err : any) => reject(err));
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
                .catch((err : any) => reject(err));
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
                        .catch((err : any) => reject(err));
                });
            });
    }
}