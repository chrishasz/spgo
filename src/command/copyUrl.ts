'use strict';
import * as vscode from 'vscode';
import { FileHelper } from '../util/fileHelper';

/**
* Copies the SharePoint URL of either the file from context menu or the currently active editor
* @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given)
* @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
*/
export default async function copySPUrl(activeResource?: vscode.Uri, absolute: boolean = false): Promise<void> {
  let editorFile = FileHelper.getActiveFile(vscode.workspace.workspaceFolders);
  let filePath = activeResource && activeResource.fsPath || editorFile && editorFile.fileName;
  if (!filePath) return vscode.window.showErrorMessage("SPGo: No file/folder selected") && undefined;
  const config = vscode.window.spgo.config;
  if (filePath.indexOf(config.workspaceRoot) == -1) return vscode.window.showErrorMessage("SPGo: File not in source directory") && undefined
  let serverRelativePath = filePath.replace(config.workspaceRoot, "").replace(/\\/g, "/");
  vscode.env.clipboard.writeText(absolute ? config.sharePointSiteUrl + serverRelativePath : serverRelativePath);
  vscode.window.showInformationMessage("SPGo: URL copied to clipboard");
}