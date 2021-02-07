'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { IPublishingAction, IConfig, ICommand } from '../spgo';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class SaveFileCommand implements ICommand {

    /**
    * Checks out the currently selected file from SharePoint
    * @param {vscode.Uri} fileUri - Optional filepath (Uses current editor if not given)
    * @param {boolean?} _props - Optional properties for this command
    */
    execute(fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Saving file:  ${fileName}`,
                vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {

                        if( fileUri.fsPath.includes(config.sourceRoot)){
                            let fileService : SPFileService = new SPFileService(config);

                            let publishAction : IPublishingAction = {
                                contentUri : fileUri.fsPath,
                                scope : null,
                                message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
                            }

                            return AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishAction)
                                .then((publishAction) => fileService.uploadFilesToServer(publishAction))
                                .then(() => {
                                    Logger.outputMessage(`File saved successfully`);
                                    Logger.updateStatusBar('File saved.', 5);
                                })
                        }
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }

    }

}
