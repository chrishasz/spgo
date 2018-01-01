'use strict';
import * as path from 'path';
import * as vscode from 'vscode';

import Uri from 'vscode-uri'

export class UrlHelper{
    // Format a server relative url based on local file uri.
    public static getServerRelativeFileUri(fileName : string) : Uri {
        let relativeFilePath = fileName.split(vscode.window.spgo.config.workspaceRoot + path.sep)[1].toString();
        let remoteFolder = relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
        let remoteFileName = relativeFilePath.substring(relativeFilePath.lastIndexOf(path.sep)+1);
        let remoteFileUrl = UrlHelper.formatFolder(remoteFolder) + remoteFileName; 
    
        return Uri.parse(this.removeTrailingSlash(vscode.window.spgo.config.sharePointSiteUrl) + remoteFileUrl);
    }
    // properly append leading and trailing '/'s to a folder path.
    public static formatFolder(path : string) : string {
        if(!path.startsWith('/')){
            path = '/' + path;
        }
        if(!path.endsWith('/')){
            path = path + '/';
        }
        return path;
    } 

    public static removeTrailingSlash(url: string): string {
        return url.replace(/(\/$)|(\\$)/, '');
    }
    
    public static removeLeadingSlash(url: string): string {
        return url.replace(/(^\/)|(^\\)/, '');
    }

    public static trimSlashes(url: string): string {
        return url.replace(/(^\/)|(^\\)|(\/$)|(\\$)/g, '');
    }
}