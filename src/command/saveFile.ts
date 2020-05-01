'use strict';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { IPublishingAction, IConfig } from '../spgo';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';

export default function saveFile(fileUri: vscode.Uri, config : IConfig) : Thenable<any> { 

    if( fileUri.fsPath.includes(config.sourceRoot)){
        let fileName : string = FileHelper.getFileName(fileUri);
        let fileService : SPFileService = new SPFileService(config);
        
        let publishAction : IPublishingAction = {
            contentUri : fileUri.fsPath,
            scope : null,
            message : config.checkInMessage || Constants.PUBLISHING_DEFAULT_MESSAGE
        }

        return UiHelper.showStatusBarProgress(`Saving file:  ${fileName}`,
            AuthenticationService.verifyCredentials(vscode.window.spgo, config, publishAction)
                .then((publishAction) => fileService.uploadFilesToServer(publishAction)) 
                .then(() => {
                    Logger.outputMessage(`File saved successfully`);
                    Logger.updateStatusBar('File saved.', 5);
                })
                .catch(err => ErrorHelper.handleError(err))
        );
    }
}