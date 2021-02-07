'use strict';
import * as vscode from 'vscode';

import { Uri } from 'vscode';
import { Logger } from '../util/logger';
import { UiHelper } from '../util/uiHelper';
import { ICommand, IConfig } from '../spgo';
import { FileHelper } from '../util/fileHelper';
import { ErrorHelper } from '../util/errorHelper';

/**
* Copies the SharePoint URL of either the file from context menu or the currently active editor
*/
export class CopySPUrlCommand implements ICommand {
    
  /**
  * Copies the SharePoint URL of either the file from context menu or the currently active editor
  * @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
  * @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
  */
  execute(fileUri : Uri, _props? : any) : Thenable<any>{
    try{
      return UiHelper.showStatusBarProgress(`Copying SharePoint URL to Clipboard`,
        vscode.window.spgo.initialize(fileUri)
          .then((config : IConfig) => {
            //define the active file or folder
            const absolute : boolean = _props;
            const editorFile = FileHelper.getActiveFile(vscode.workspace.workspaceFolders);
            const filePath = fileUri && fileUri.fsPath || editorFile && editorFile.fileName;
            const serverRelativePath = filePath.replace(config.sourceRoot, "").replace(/\\/g, "/");
        
            //copy to clipboard and emit message
            vscode.env.clipboard.writeText(absolute ? config.sharePointSiteUrl + serverRelativePath : serverRelativePath);
            Logger.outputMessage("URL copied to clipboard");
            Logger.updateStatusBar('URL copied to clipboard.', 5);
          })
          .catch(err => ErrorHelper.handleError(err))
      );
    } catch (err) {
      ErrorHelper.handleError(err, true)
    }
  } 

}
