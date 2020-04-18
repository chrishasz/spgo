'use strict';
import * as path from 'path';

import { Uri } from 'vscode'
import { IConfig } from '../spgo';

export class UrlHelper{
    
    //Make sure there is a leading slash.
    public static ensureLeadingSlash(filePath : string) : string{
        if(!filePath.startsWith(path.sep)){
            filePath = path.sep + filePath;
        }
        return filePath;
    }

    //Make sure there is a leading web slash (This is sort of a multi-platform hack).
    public static ensureLeadingWebSlash(filePath : string) : string{
        if(!filePath.startsWith('/')){
            filePath = '/' + filePath;
        }
        return filePath;
    }
    
    // replaces all non-alphanumeric characters with the '_' character.
    public static formatUriAsFileName(uri : string) : string {
        return uri.replace(/[^a-zA-Z0-9]/g,'_');
    }

    // properly append leading and trailing '/'s to a folder path.
    public static formatWebFolder(filePath : string) : string {
        if(!filePath.startsWith('/')){
            filePath = '/' + filePath;
        }
        if(!filePath.endsWith('/')){
            filePath = filePath + '/';
        }
        return filePath;
    } 
    
    // return the filename from a uri-style string. returns the final token after the last os-specific slash
    // ex: path/to/the/filename.ext => filename.ext
    public static getFileName(filePath : string) : string{
       return filePath.split('\\').pop().split('/').pop();
    }

    //get the file path relative to the current SharePoint site.
    public static getSiteRelativeFilePath(fileName : string, config : IConfig) : string {
        return fileName.split(config.sourceRoot + path.sep)[1].toString();
    }

    //get the file path relative to the current SharePoint site as a Uri.
    public static getSiteRelativeFileUri(fileName : string, config : IConfig) : Uri {
        return Uri.parse(this.getSiteRelativeFilePath(fileName, config));
    }

    // Format a server relative url based on local file uri.
    public static getServerRelativeFilePath(fileName : string, config : IConfig) : string {
        let relativeFilePath : string = this.getSiteRelativeFilePath(fileName, config);
        let remoteFolder = relativeFilePath.substring(0, relativeFilePath.lastIndexOf(path.sep));
        let remoteFileName = this.getFileName(relativeFilePath);
        let remoteFileUrl = this.normalizeSlashes(UrlHelper.formatWebFolder(remoteFolder) + remoteFileName); 
    
        return this.removeTrailingSlash(config.sharePointSiteUrl) + remoteFileUrl;
    }

    // Format a server relative url based on local file uri.
    public static getServerRelativeFileUri(fileName : string, config : IConfig) : Uri {
    
        return Uri.parse(this.getServerRelativeFilePath(fileName, config));
    }

    // determines if the string provided is a file or folder.
    // determination method => string includes a '.', but is not just '.' and does not contain a Glob wildcard '*'
    public static isFile(uri : string) : boolean {
        const fileName : string = this.getFileName(uri);

        return fileName.includes('.') && fileName != '.' && fileName.indexOf('*') < 0;
    }

    static normalizeSlashes(filePath : string) : string{
        return filePath.replace(/\\/g, "/");
    }

    // make our glob processor os aware.
    // this is also for cross-platform compatibility, but much less hacky.
    public static osAwareGlobStar() : string {
        return path.sep + '**' + path.sep + '*.*';
    }

    //Make sure there is no leading slash.
    public static removeTrailingSlash(url: string): string {
        return url.replace(/(\/$)|(\\$)/, '');
    }
    
    //Make sure there is no leading slash.
    public static removeLeadingSlash(url: string): string {
        return url.replace(/(^\/)|(^\\)/, '');
    }

    //Make sure there are no slashes either place.
    public static trimSlashes(url: string): string {
        return url.replace(/(^\/)|(^\\)|(\/$)|(\\$)/g, '');
    }
}