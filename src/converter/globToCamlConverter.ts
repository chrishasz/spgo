'use strict';

import * as vscode from 'vscode';
import * as parseGlob from 'parse-glob';

import {Uri, window} from 'vscode';
import {ISPPullOptions} from 'sppull';
// import {FileHelper} from './../util/fileHelper';

export class GlobToCamlConverter {

    public glob: any;

    constructor(path : string){
        this.glob = parseGlob(path);
    }

    // private GetCamlQuery() : string{

    //     this.glob

    //     return 'asdf';
    // }

    public Convert() : ISPPullOptions{
        let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
        let remoteFolder : string = this.glob.orig;//FileHelper.getFolderFromPath(this.glob.orig);

        let options : any = {
            spBaseFolder : sharePointSiteUrl.path === '' ? '/' : sharePointSiteUrl.path, 
            spRootFolder : remoteFolder.replace('/**/','/'),
            dlRootFolder: window.spgo.config.workspaceRoot,
            recursive : this.glob.is.globstar,
            createEmptyFolders : this.glob.is.globstar
        };

        return options;
    }
}