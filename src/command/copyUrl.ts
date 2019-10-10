'use strict';
import * as vscode from 'vscode';

import { Logger } from '../util/logger';
import { ErrorHelper } from '../util/errorHelper';
import { FileHelper } from '../util/fileHelper';


/**
* Copies the SharePoint URL of either the file from context menu or the currently active editor
* @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
* @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
*/
export default async function copySPUrl(activeResource?: vscode.Uri, absolute: boolean = false): Promise<void> {
  try {
    //define the active file or folder
    let editorFile = FileHelper.getActiveFile(vscode.workspace.workspaceFolders);
    let filePath = activeResource && activeResource.fsPath || editorFile && editorFile.fileName;
    let serverRelativePath = filePath.replace(vscode.window.spgo.config.workspaceRoot, "").replace(/\\/g, "/");

    //copy to clipboard and emit message
    vscode.env.clipboard.writeText(absolute ? vscode.window.spgo.config.sharePointSiteUrl + serverRelativePath : serverRelativePath);
    Logger.outputMessage("SPGo: URL copied to clipboard");

  } catch (err) {
    ErrorHelper.handleError(err, true)
  }
}