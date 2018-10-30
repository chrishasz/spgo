'use strict';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from './../constants';
import { UrlHelper } from '../util/urlHelper';
import { IPublishingAction } from './../spgo';
import { UiHelper } from './../util/uiHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from './../service/spFileService';
import { AuthenticationService } from './../service/authenticationService';

export default function publishWorkspace() : Thenable<any> {
    let publishingInfo : IPublishingAction = {
        contentUri : vscode.window.spgo.config.publishWorkspaceGlobPattern ? UrlHelper.ensureLeadingSlash(vscode.window.spgo.config.publishWorkspaceGlobPattern) : vscode.window.spgo.config.workspaceRoot + UrlHelper.osAwareGlobStar(),
        scope : Constants.PUBLISHING_MAJOR,
        message : vscode.window.spgo.config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
    }
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService();
    
    return UiHelper.showStatusBarProgress('Publishing workspace', 
        AuthenticationService.verifyCredentials(vscode.window.spgo, publishingInfo)
            .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
            .then((publishingInfo) => fileService.uploadFilesToServer(publishingInfo))
            .then(()=>{Logger.outputMessage('Workspace Publish complete.', vscode.window.spgo.outputChannel)})
            .catch(err => ErrorHelper.handleError(err))
    );
}
