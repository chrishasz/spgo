'use strict';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { ErrorHelper } from '../util/errorHelper';
import { IPublishingAction, IConfig } from '../spgo';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

export default function publishWorkspace(config : IConfig) : Thenable<any> {
    let publishingInfo : IPublishingAction = {
        contentUri : config.publishWorkspaceGlobPattern ? UrlHelper.ensureLeadingSlash(config.publishWorkspaceGlobPattern) : config.workspaceRoot + UrlHelper.osAwareGlobStar(),
        scope : Constants.PUBLISHING_MAJOR,
        message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
    }
    Logger.outputMessage('Starting Workspace Publish...', vscode.window.spgo.outputChannel);
    let fileService : SPFileService = new SPFileService(config);
    
    return UiHelper.showStatusBarProgress('Publishing workspace', 
        AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishingInfo)
            .then((publishingInfo) => UiHelper.getPublishingMessage(publishingInfo))
            .then((publishingInfo) => fileService.uploadFilesToServer(publishingInfo))
            .then(()=>{Logger.outputMessage('Workspace Publish complete.', vscode.window.spgo.outputChannel)})
            .catch(err => ErrorHelper.handleError(err))
    );
}
