'use strict';
//import checkOutFile from '../command/checkOutFile';
var sppull = require("sppull").sppull;
//import * as path from 'path';

import Uri from 'vscode-uri';
import * as vscode from 'vscode';
import {ISPRequest} from 'sp-request';


import {Logger} from '../util/logger';
// import Constants from './../constants';
// import {UrlHelper} from './../util/UrlHelper';
import { IError, IFileInformation } from './../spgo';
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
                .then(function(){
                    resolve();
                }, err => {
                    reject(err);
                });
                
        });
    }

    public downloadFiles(remoteFolder: string, context : any, fileOptions : any) : Promise<any>{
        return new Promise(function (resolve, reject) {
            
            sppull(context, fileOptions)
                .then(function(downloadResults) {
                    Logger.outputMessage(`Successfully downloaded ${downloadResults.length} files to: ${vscode.window.spgo.config.sourceDirectory + remoteFolder}`, vscode.window.spgo.outputChannel);
                    resolve();
                })
                .catch(function(err){
                    //TODO: this is sorta hacky- Detect if this error was due to credentials - FATAL ERROR
                    if(err.message.indexOf('wst:FailedAuthentication') > 0){
                        vscode.window.spgo.credential = null;
                        let error : IError ={
                            message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                        };
                        Logger.outputError(error, vscode.window.spgo.outputChannel);
                        reject();
                    }
                    //otherwise something else happened. - NON FATAL
                    else{
                        Logger.outputError(err, vscode.window.spgo.outputChannel);
                        reject();
                    }
                });
        });
    }

    // public downloadFile() : Promise<any>{
    //     return new Promise();
    // }

    public getFileInformation( fileUri : Uri, spr : ISPRequest ) : Promise<any>{
        return new Promise(function (resolve, reject) {
                        
            spr.requestDigest(vscode.window.spgo.config.sharePointSiteUrl)
                .then(digest => {
                    return spr.get(vscode.window.spgo.config.sharePointSiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileUri.path +"')/?$select=Name,ServerRelativeUrl,CheckOutType,TimeLastModified,CheckedOutByUser", {
                        body: {},
                        headers: RequestHelper.createHeaders(vscode.window.spgo, digest)
                    })
                    .then( response => {
                        let fileInfo : IFileInformation = {
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
                    }, err => {
                        Logger.outputError(err, vscode.window.spgo.outputChannel);
                        reject(err);
                    });
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
                .then(function(){ //response => {
                    resolve();
                }, err => {
                    reject(err);
                });
        });
    }

}