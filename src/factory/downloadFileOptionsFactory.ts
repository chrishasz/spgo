'use strict';

import * as vscode from 'vscode';
import * as parseGlob from 'parse-glob';

import {Uri, window} from 'vscode';
import {ISPPullOptions} from 'sppull';
import {UrlHelper} from './../util/UrlHelper';
import { GlobToCamlConverter } from '../converter/globToCamlConverter';

export class DownloadFileOptionsFactory {

    public glob: any;

    constructor(path : string){
        this.glob = parseGlob(path);
    }

    public createFileOptions() : ISPPullOptions{
        let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
        let remoteFolder : string = this.glob.path.dirname;
        let camlQuery : string = GlobToCamlConverter.Convert(this.glob);

        let options : ISPPullOptions = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path,
            dlRootFolder: window.spgo.config.workspaceRoot,
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

        return options;
    }
}