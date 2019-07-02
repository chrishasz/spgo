import * as vscode from 'vscode';

/**
* Copies the SharePoint URL of either the file from context menu or the currently active editor
* @param {vscode.Uri} resourcePath - Optional filepath (Uses current editor if not given
* @param {boolean} absolute - Option to copy the absolute path (defaults to SPGo Config)
*/
export default function copySPUrl(resourcePath?: vscode.Uri, absolute: boolean = false) {
  console.log("Resource: ", resourcePath.fsPath);
  console.log("Absolute: ", absolute);
}