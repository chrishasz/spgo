'use strict';

import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { ISPPullOptions } from 'sppull';
import { Constants } from '../constants';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ICoreOptions, FileOptions } from 'spsave';
import { ISPRequest, IAuthOptions } from 'sp-request';
import { RequestHelper } from '../util/requestHelper';
import { SPFileGateway } from '../gateway/spFileGateway';
import { WorkspaceHelper } from '../util/workspaceHelper';
import { IPublishingAction, IConfig, IFileGateway } from '../spgo';
import { DownloadFileOptionsFactory } from '../factory/downloadFileOptionsFactory';

export class SPFileService{

    _config : IConfig;
    _fileGateway : IFileGateway;

    constructor (config : IConfig, gateway? : IFileGateway){
        this._config = config;
        this._fileGateway = gateway || new SPFileGateway(config);
    }

    public checkOutFile(textDocument: Uri) : Promise<any>{

        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fsPath, this._config);

        return this._fileGateway.checkOutFile(fileUri, spr);
    }

    public deleteFileFromServer(fileUri: Uri) : Promise<any> {

        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(fileUri.fsPath, this._config);

        return this._fileGateway.deleteFile(remoteFileUri, spr);
    }

    public downloadFiles(siteUrl: Uri, remoteFolder : string) : Promise<any>{

        //format the remote folder to /<folder structure>/
        remoteFolder = UrlHelper.ensureLeadingWebSlash(remoteFolder);
        let factory : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(remoteFolder);

        let context : any = {
            siteUrl : siteUrl.toString(),
            creds   : RequestHelper.createCredentials(vscode.window.spgo, this._config)
        };

        let options : ISPPullOptions = factory.createFileOptions(siteUrl, this._config);
        //let localFolder : string = options.dlRootFolder + UrlHelper.removeLeadingSlash(FileHelper.convertToForwardSlash(options.spRootFolder));

        return this._fileGateway.downloadFiles(context, options);
    }

    public downloadFileMajorVersion(filePath : Uri, downloadFilePath? : string) : Promise<any>{

        let remoteFolder : string = FileHelper.getFolderFromPath(filePath, this._config);
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        let sharePointSiteUrl : Uri = WorkspaceHelper.getSiteUriForActiveWorkspace(remoteFileUri.path, this._config);

        let context : any = {
            siteUrl : sharePointSiteUrl.toString(),
            creds   : RequestHelper.createCredentials(vscode.window.spgo, this._config)
        };

        let options : any = {
            spBaseFolder    : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path,
            spRootFolder    : UrlHelper.normalizeSlashes(remoteFolder),
            strictObjects   : [remoteFileUri.path],
            dlRootFolder    : downloadFilePath
        };
        //let localFolder : string = options.dlRootFolder + UrlHelper.removeLeadingSlash(FileHelper.convertToForwardSlash(options.spRootFolder));

        return this._fileGateway.downloadFiles(context, options);
    }

    // CheckOutType: Online = 0; Offline = 1; None = 2.
    // all status values: https://msdn.microsoft.com/en-us/library/office/dn450841.aspx
    public getFileInformation(textDocument: Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(textDocument.fsPath, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);

        Logger.outputMessage(`Getting file information for:  ${textDocument.fsPath}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.getFileInformation(fileUri, spr);
    }

    public checkoutFile(filePath: Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);

        Logger.outputMessage(`Checking out File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.checkOutFile(fileUri, spr);
    }

    //TODO: Test this function to work with custom publishWorkspaceOptions props.
    public publishWorkspace(publishingInfo : IPublishingAction) : Promise<any> {

        //let publishingOptions : IPublishWorkspaceOptions = this.buildPublishingOptions(this._config.publishWorkspaceOptions);
        let credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo, this._config);
        let remoteFileUri : Uri = Uri.parse(`${this._config.sharePointSiteUrl}${this._config.publishWorkspaceOptions.destinationFolder}`);//UrlHelper.getServerRelativeFileUri(publishingOptions.globPattern, this._config);
        let coreOptions : ICoreOptions = this.buildCoreUploadOptions(remoteFileUri, publishingInfo);
        let fileOptions : FileOptions = {
            glob    : this._config.publishWorkspaceOptions.globPattern,
            folder  : this._config.publishWorkspaceOptions.destinationFolder,
            base    : this._config.publishWorkspaceOptions.localRoot
        };

        Logger.outputMessage(`publishing files:  ${this._config.publishWorkspaceOptions.globPattern}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.uploadFiles(coreOptions, credentials, fileOptions);
    }

    public undoFileCheckout(filePath: vscode.Uri) : Promise<any>{
        let fileUri : Uri = UrlHelper.getServerRelativeFileUri(filePath.fsPath, this._config);
        let spr : ISPRequest = RequestHelper.createRequest(vscode.window.spgo, this._config);

        Logger.outputMessage(`Discarding Check out for File:  ${fileUri.fsPath}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.undoCheckOutFile(fileUri, spr);
    }

    public uploadFilesToServer(publishingInfo : IPublishingAction) : Promise<any> {

        let credentials : IAuthOptions = RequestHelper.createCredentials(vscode.window.spgo, this._config);
        let remoteFileUri : Uri = UrlHelper.getServerRelativeFileUri(publishingInfo.contentUri, this._config);
        let coreOptions : ICoreOptions = this.buildCoreUploadOptions(remoteFileUri, publishingInfo);
        let localFilePath : string = this.calculateBaseFolder(coreOptions);
        let fileOptions : FileOptions = {
            glob    : publishingInfo.contentUri,
            base    : localFilePath,
            folder  : '/'
        };

        Logger.outputMessage(`Uploading file:  ${publishingInfo.contentUri}`, vscode.window.spgo.outputChannel);

        return this._fileGateway.uploadFiles(coreOptions, credentials, fileOptions);
    }

    private buildCoreUploadOptions(remoteFileUri : Uri, publishingInfo : IPublishingAction) : any {
        var coreOptions : ICoreOptions = {
            siteUrl         : WorkspaceHelper.getSiteUriForActiveWorkspace(remoteFileUri.toString(), this._config).toString(),
            checkinMessage  : encodeURI(publishingInfo.message),
            checkin         : false
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

    // helper for SPPush integration - need to append the SubSite root to the 'local folder' path otherwise you get duplicate tokens in path
    // e.g. test.js successfully uploaded to 'https://<server>/sites/site/subsite/subsite/Style Library'
    private calculateBaseFolder(coreOptions : ICoreOptions){

        let subSiteUrl : string = coreOptions.siteUrl.split(this._config.sharePointSiteUrl)[1];
        return this._config.sourceRoot + FileHelper.convertToForwardSlash(subSiteUrl);
    }
}
