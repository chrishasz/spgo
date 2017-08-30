'use strict';
import * as vscode from 'vscode';
import * as SPGo from '../spgo';

export function outputMessage(message: string, outputChannel: vscode.OutputChannel) {
    outputChannel.appendLine(message);
    console.log(message);
    return false;
};

export function outputError(error: SPGo.IError, outputChannel: vscode.OutputChannel) {
    outputChannel.appendLine('================================     ERROR     ================================\n');
    outputChannel.appendLine(error.message);
    console.error(error);
    return false;
};
export function showError(message : string){
    vscode.window.showErrorMessage(message);
}

export function showInfo(message : string){
    vscode.window.showInformationMessage(message);
}

export function showWarning(message : string){
    vscode.window.showWarningMessage(message);
}