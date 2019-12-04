import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { IConfig } from '../../src/spgo';
import { Constants } from '../../src/constants';
import { DownloadFileOptionsFactory } from '../../src/factory/downloadFileOptionsFactory';
import { ISPPullOptions } from 'sppull/dist/interfaces';



describe("Convert Glob to Caml Tests", () => {
    
    let globRoot : string = 'path/';

    let config : IConfig = {
            authenticationType : Constants.SECURITY_DIGEST,
            publishingScope : Constants.PUBLISHING_NONE,
            sourceDirectory : '/sites/spgo',      // The relative directory structure underneath the VSCode local workspace root directory
            workspaceRoot : `${vscode.workspace.workspaceFolders[0].uri}${path.sep}${'src'}`
    };
    
    beforeEach(() => {
        
    });

    it("Should test the Constructor", () => {
        let globString : string = globRoot;
        let converter : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(globString);

        assert.equal(converter.glob.orig, globString);
    });

    it("Should detect when a valid source directory has been provided", () => {
        let globString : string = globRoot;
        let converter : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(globString);

        assert.equal(converter.glob.orig, globString);
    });

    it("Should detect when a folder structure has a globstar", () => {
        let globString : string = 'siteassets/**';
        let siteUrl : Uri = Uri.parse('https://company.sitego.co/sites/spgo/siteassets/**');
        let converter : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(globString);
        let options : ISPPullOptions = converter.createFileOptions(siteUrl, config);

        assert.equal(converter.glob.is.globstar, true);
        assert.equal(options.recursive, true);
        assert.equal(options.createEmptyFolders, true);
    });

    it("Should detect when a folder structure does not have a globstar", () => {
        let globString : string = 'siteassets';
        let siteUrl : Uri = Uri.parse('https://company.sitego.co/sites/spgo/siteassets/**');
        let converter : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(globString);
        let options : ISPPullOptions = converter.createFileOptions(siteUrl, config);

        assert.equal(converter.glob.is.globstar, false);
        assert.equal(options.recursive, false);
        assert.equal(options.createEmptyFolders, false);
    });

});