'use strict';

import * as vscode from 'vscode';
import * as parseGlob from 'parse-glob';
import * as globToRegExp from 'glob-to-regexp';

import { Uri } from 'vscode';
import { ISPPullOptions } from 'sppull';
import { UrlHelper } from './../util/urlHelper';
import { FileHelper } from './../util/fileHelper';

export class DownloadFileOptionsFactory {

    public glob: any;

    constructor(path : string){
        this.glob = parseGlob(path);
    }

    public createFileOptions(siteUrl: Uri) : ISPPullOptions{
        //let sharePointSiteUrl : Uri = Uri.parse(vscode.window.spgo.config.sharePointSiteUrl);
        let dlRootFolder : string = FileHelper.ensureCorrectPathSeparator(
            vscode.window.spgo.config.workspaceRoot + siteUrl.toString().replace(vscode.window.spgo.config.sharePointSiteUrl, ''));
        let options : ISPPullOptions = {
            spBaseFolder : UrlHelper.ensureLeadingWebSlash(siteUrl.path),
            dlRootFolder: dlRootFolder
        }
        let globPattern : string = options.spBaseFolder === '/' ? this.glob.orig : options.spBaseFolder + this.glob.orig;

        if(this.glob.is.glob){
            options.spRootFolder = this.glob.base.replace('/**/','/');
            options.fileRegExp = globToRegExp(globPattern, { flags: 'i', globstar : this.glob.is.globstar, extended : this.glob.orig.indexOf('|') >= 0 });
        }
        else{
            options.spRootFolder = UrlHelper.formatWebFolder(this.glob.orig);
        }

        options.recursive = this.glob.is.globstar;
        options.createEmptyFolders = false;

        return options;
    }
}
