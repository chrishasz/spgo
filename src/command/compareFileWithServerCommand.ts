'use strict';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { ICommand, IConfig } from '../spgo';
import { Logger } from '../util/logger';
import { Constants } from '../constants';
import { UiHelper } from '../util/uiHelper';
import { UrlHelper } from '../util/urlHelper';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';
import { SPFileService } from '../service/spFileService';
import { AuthenticationService } from '../service/authenticationService';
import { Uri } from 'vscode';


/**
 * 
 */
export class CompareFileWithServerCommand implements ICommand {
    
    /**
    * Compares the current local file to the current SharePoint version.
    * @param {vscode.Uri} fileUri - Filepath (Uses current editor if not given)
    * @param {boolean?} props - Optional properties for this command
    */
    public execute(fileUri : Uri, _props? : any) : Thenable<any>{

        try{
            let fileName : string = FileHelper.getFileName(fileUri);

            return UiHelper.showStatusBarProgress(`Downloading Server version of: ${fileName}`, 
                vscode.window.spgo.initialize(fileUri)
                    .then((config : IConfig) => {

                        //is this a directory?
                        if(fs.lstatSync(fileUri.fsPath).isDirectory()){
                            Logger.showWarning('The compare file with server command only works for single files at this time.')
                        }
                        else{
                            if( fileUri.fsPath.includes(config.sourceRoot)){
                                let fileName : string = FileHelper.getFileName(fileUri);
                                let fileService : SPFileService = new SPFileService(config);
                                let downloadPath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER;

                                Logger.outputMessage(`Starting file compare for: ${fileName}`, vscode.window.spgo.outputChannel);
                                
                                return AuthenticationService.verifyCredentials(vscode.window.spgo, config, fileUri)
                                    .then((fileUri) => fileService.downloadFileMajorVersion(fileUri, downloadPath))
                                    .then((dlFileUrl) => this.openFileCompare(fileUri, dlFileUrl))
                                    .then(() => Logger.updateStatusBar('File Download Complete.', 5));                               
                            }
                        }

                    })
                    .catch(err => ErrorHelper.handleError(err))
                );
        } catch (err) {
            ErrorHelper.handleError(err, true)
        }
    
    }
    
    /**
     * Open the VSCode file compare for a local and server copy of a file
     * 
     * @param fileUri Local file URI
     * @param dlFileUrl Server URL for the file
     */
    public openFileCompare(fileUri : vscode.Uri, dlFileUrl : any){            
        if( dlFileUrl && dlFileUrl.length > 0){
            let remotePath : vscode.Uri = vscode.Uri.parse('file:///' + UrlHelper.removeLeadingSlash(dlFileUrl[0].SavedToLocalPath));
            Logger.outputMessage(`localPath:  ${fileUri} dlFileUrl: ${remotePath}`, vscode.window.spgo.outputChannel);

            vscode.commands.executeCommand('vscode.diff', remotePath, fileUri, '(Server)  <=====>  (Local)');
        }
        else{
            Logger.outputMessage('Could not download file for compare');
        }
    }
}
