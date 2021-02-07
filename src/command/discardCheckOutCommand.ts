'use strict';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { ICommand, IConfig } from '../spgo';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class DiscardCheckOutCommand implements ICommand {

    /**
    * Checks out the currently selected file from SharePoint
    * @param {vscode.Uri} fileUri - Optional filepath (Uses current editor if not given)
    * @param {boolean?} props - Optional properties for this command
    */
    execute(fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Discarding Check out for:  ${fileName}`,
                vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {
                        // is this a directory?
                        // if so, tell the user we are too lazy to implement a recursive version of discard checkout.
                        if(fs.lstatSync(fileUri.fsPath).isDirectory()){
                            Logger.showWarning('The discard file check-out command only works for single files at this time.')
                        }
                        // undo the checkout.
                        else{
                            if( fileUri.fsPath.includes(config.sourceRoot)){
                                let fileService : SPFileService = new SPFileService(config);

                                return AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                                    .then((filePath) => fileService.undoFileCheckout(filePath))
                                    .then(() => {
                                        Logger.outputMessage(`Discard check-out successful for file ${fileUri.fsPath}.`, vscode.window.spgo.outputChannel);
                                    });
                            }
                        }
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }

    }
}
