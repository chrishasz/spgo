'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger} from '../util/logger';
import { UiHelper} from '../util/uiHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService} from '../service/spFileService';
import { ISPFileInformation, IConfig, ICommand } from '../spgo';
import { AuthenticationService } from '../service/authenticationService';

/*
*
*/
export class GetCurrentFileInformationCommand implements ICommand {

    /**
    *
    * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
    * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
    */
    execute(fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            const fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Getting file status for:  ${fileName}`,
                 vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {
                        if( fileUri.fsPath.includes(config.sourceRoot) && !fileUri.fsPath.endsWith('.git')){
                            let fileService : SPFileService = new SPFileService(config);

                            return AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                                .then((textDocument) => fileService.getFileInformation(textDocument))
                                .then((fileInfo) => this.showFileInformation(fileInfo))

                        }
                    })
                    .catch(err => ErrorHelper.handleError(err))
            );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    }

    public showFileInformation(fileInfo : ISPFileInformation) : void {

        //TODO: Clarify checkout types 0, 1, 2 - what do the numbers mean.
        Logger.outputMessage(fileInfo.checkOutBy ? 'Check out Type: ' + fileInfo.checkOutType + ' by user: ' + fileInfo.checkOutBy : 'Check out Type: ' + fileInfo.checkOutType);

        if( fileInfo.checkOutType == 0 || fileInfo.checkOutType == 1){
            let message : string = `File Checked out to user: ${fileInfo.checkOutBy}`;
            Logger.updateStatusBar(message, 5);
        }
        else{
            Logger.updateStatusBar(`File is not checked out.`, 5);
        }
    }
}
