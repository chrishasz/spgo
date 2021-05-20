'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { WorkspaceHelper } from '../util/workspaceHelper';
import { IPublishingAction, IConfig, ICommand } from '../spgo';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class PublishWorkspaceCommand implements ICommand {

    /**
    *
    * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
    * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
    */
    execute(_fileUri : Uri, _props? : any) : Thenable<any>{

        try{

            return UiHelper.showStatusBarProgress('Publishing workspace',
                WorkspaceHelper.getActiveWorkspaceUri()
                    .then((activeWorkspace) => vscode.window.spgo.initialize(activeWorkspace))
                    .then((config : IConfig) => {
                        let publishingInfo : IPublishingAction = {
                            contentUri : null,
                            scope : Constants.PUBLISHING_MAJOR,
                            message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
                        }
                        Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
                        let fileService : SPFileService = new SPFileService(config);

                        return AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishingInfo)
                            .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
                            .then((publishingInfo) => fileService.publishWorkspace(publishingInfo))
                            .then(()=>{
                                Logger.updateStatusBar('Workspace Publish complete.', 5)
                            });
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

}
