//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';

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


describe("App Manager Tests", () => {

    it("Something 1", () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
});