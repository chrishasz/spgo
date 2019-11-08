import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';

// import {Constants} from './../constants';
import { Uri } from 'vscode';
import { AppManager } from '../../src/appManager';
import { DownloadFileOptionsFactory } from './../../src/factory/downloadFileOptionsFactory';
import { Constants } from '../../src/constants';
import { ISPPullOptions } from 'sppull/dist/interfaces';



describe("Convert Glob to Caml Tests", () => {
    
    let globRoot : string = 'path/'
    
    beforeEach(() => {
        vscode.window.spgo = new AppManager();
        vscode.window.spgo.config = {
            authenticationType : Constants.SECURITY_DIGEST,
            publishingScope : Constants.PUBLISHING_NONE,
            sourceDirectory : '/sites/spgo',      // The relative directory structure underneath the VSCode local workspace root directory
            workspaceRoot : `${vscode.workspace.rootPath}${path.sep}${'src'}`
        };
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
        let options : ISPPullOptions = converter.createFileOptions(siteUrl);

        assert.equal(converter.glob.is.globstar, true);
        assert.equal(options.recursive, true);
        assert.equal(options.createEmptyFolders, true);
    });

    it("Should detect when a folder structure does not have a globstar", () => {
        let globString : string = 'siteassets';
        let siteUrl : Uri = Uri.parse('https://company.sitego.co/sites/spgo/siteassets/**');
        let converter : DownloadFileOptionsFactory = new DownloadFileOptionsFactory(globString);
        let options : ISPPullOptions = converter.createFileOptions(siteUrl);

        assert.equal(converter.glob.is.globstar, false);
        assert.equal(options.recursive, false);
        assert.equal(options.createEmptyFolders, false);
    });

});