'use strict';

import * as vscode from 'vscode';
import * as parseGlob from 'parse-glob';

import {Uri, window} from 'vscode';
import {ISPPullOptions} from 'sppull';
import {UrlHelper} from './../util/UrlHelper';
import { GlobToCamlConverter } from '../converter/globToCamlConverter';
// import {FileHelper} from './../util/fileHelper';

export class DownloadFileOptionsFactory {

    public glob: any;

    constructor(path : string){
        this.glob = parseGlob(path);
    }

    public createFileOptions() : ISPPullOptions{
        let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
        let remoteFolder : string = this.glob.path.dirname;//.orig;
        let camlQuery : string = GlobToCamlConverter.Convert(this.glob);

        let options : ISPPullOptions = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
            //spRootFolder : remoteFolder.replace('/**/','/'),
            dlRootFolder: window.spgo.config.workspaceRoot,
            //recursive : this.glob.is.globstar,
            //createEmptyFolders : this.glob.is.globstar,
            //camlCondition : camlQuery == '' ? null : camlQuery
        }

        if(this.glob.is.glob){
            if(camlQuery != ''){
                options.spDocLibUrl = remoteFolder;
                options.camlCondition = camlQuery;
                
            }
            else{
                options.recursive = this.glob.is.globstar;
                options.spRootFolder = remoteFolder.replace('/**/','/');
                options.createEmptyFolders = this.glob.is.globstar;
            }
        }
        else{
            options.spRootFolder = UrlHelper.formatWebFolder(this.glob.orig);
            options.recursive = false;
            options.createEmptyFolders = false;
        }

        // let options : ISPPullOptions = {
        //     spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
        //     //spRootFolder : remoteFolder.replace('/**/','/'),
        //     dlRootFolder: window.spgo.config.workspaceRoot,
        //     //recursive : this.glob.is.globstar,
        //     createEmptyFolders : this.glob.is.globstar,
        //     camlCondition : camlQuery == '' ? null : camlQuery
        //     /*
        //     spHostName?: string;
        //     spRelativeBase?: string;
        //     spRootFolder?: string;
        //     spBaseFolder?: string;
        //     dlRootFolder?: string;
        //     recursive?: boolean;
        //     foderStructureOnly?: boolean;
        //     createEmptyFolders?: boolean;
        //     metaFields?: string[];
        //     restCondition?: string;
        //     muteConsole?: boolean;
        //     camlCondition?: string;
        //     spDocLibUrl?: string;
        //     omitFolderPath?: string;
        //     strictObjects?: string[];
        //     */
        // };

        // let options : ISPPullOptions = {
        //     spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
        //     spRootFolder : remoteFolder.replace('/**/','/'),
        //     dlRootFolder: window.spgo.config.workspaceRoot,
        //     recursive : this.glob.is.globstar,
        //     createEmptyFolders : this.glob.is.globstar,
        //     camlCondition : camlQuery == '' ? null : camlQuery
        //     /*
        //     spHostName?: string;
        //     spRelativeBase?: string;
        //     spRootFolder?: string;
        //     spBaseFolder?: string;
        //     dlRootFolder?: string;
        //     recursive?: boolean;
        //     foderStructureOnly?: boolean;
        //     createEmptyFolders?: boolean;
        //     metaFields?: string[];
        //     restCondition?: string;
        //     muteConsole?: boolean;
        //     camlCondition?: string;
        //     spDocLibUrl?: string;
        //     omitFolderPath?: string;
        //     strictObjects?: string[];
        //     */
        // };

        return options;
    }
}