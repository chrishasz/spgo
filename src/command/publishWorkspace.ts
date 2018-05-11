'use strict';
import * as vscode from 'vscode';

import {Logger} from '../util/logger';
import {Constants} from './../constants';
import {IPublishingAction} from './../spgo';
import {UiHelper} from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import {SPFileService} from './../service/spFileService';
import {AuthenticationService} from './../service/authenticationservice';

export default function publishWorkspace() : Thenable<any> {
    let publishingInfo : IPublishingAction = {
        fileUri : null,
        scope : Constants.PUBLISHING_MAJOR,
        message : vscode.window.spgo.config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
    }
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService();
    
    return UiHelper.showStatusBarProgress('Publishing workspace', 
        AuthenticationService.verifyCredentials(vscode.window.spgo, publishingInfo)
            .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
            .then((publishingInfo) => fileService.uploadWorkspaceToServer(publishingInfo))
            .catch(err => ErrorHelper.handleError(err))
    );
}
