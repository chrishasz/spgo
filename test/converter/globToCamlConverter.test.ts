import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as parseGlob from 'parse-glob';

// import {Constants} from './../constants';
import {AppManager} from '../../src/appManager';
import {GlobToCamlConverter} from './../../src/converter/globToCamlConverter';
import {Constants} from '../../src/constants';

// import compareFileWithServer from './command/compareFileWithServer';
// import {Logger} from './util/logger';
// import configureWorkspace from './command/configureWorkspace';
// import initializeConfiguration from './dao/configurationDao';
// import discardCheckOut from './command/discardCheckOut';
// import resetCredentials from './command/resetCredentials';
// import populateWorkspace from './command/populateWorkspace';
// import publishWorkspace from './command/publishWorkspace';
// import retrieveFolder from './command/retrieveFolder';
// import checkOutFile from './command/checkOutFile';
// import publishFile from './command/publishFile';
// import saveFile from './command/saveFile';
// import getCurrentFileInformation from './command/getCurrentFileInformation';
// import {Constants} from './constants';


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

    it("Should return an empty string if there is no glob", () => {
        let glob : any = parseGlob(globRoot);

        assert.equal(GlobToCamlConverter.Convert(glob, ''), '');
    });

    // it("Should detect when a valid source directory has been provided", () => {
    //     let globString : string = globRoot;
    //     let converter : GlobToCamlConverter = new GlobToCamlConverter(globString);

    //     assert.equal(converter.glob.orig, globString);
    // });

    // it("Should detect when a folder structure has a globstar", () => {
    //     let globString : string = 'siteassets/**';
    //     let converter : GlobToCamlConverter = new GlobToCamlConverter(globString);
    //     let options : ISPPullOptions = converter.Convert();

    //     assert.equal(converter.glob.is.globstar, true);
    //     assert.equal(options.recursive, true);
    //     assert.equal(options.createEmptyFolders, true);
    // });

    // it("Should detect when a folder structure does not have a globstar", () => {
    //     let globString : string = 'siteassets';
    //     let converter : GlobToCamlConverter = new GlobToCamlConverter(globString);
    //     let options : ISPPullOptions = converter.Convert();

    //     assert.equal(converter.glob.is.globstar, false);
    //     assert.equal(options.recursive, false);
    //     assert.equal(options.createEmptyFolders, false);
    // });

});