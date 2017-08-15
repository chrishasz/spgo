'use strict';
import * as vscode from 'vscode';
import * as SPGo from '../spgo';

export function outputMessage(message: string, outputChannel: vscode.OutputChannel) {
    //vscode.window.spgo.statusBarItem.text = 'SPGo: ' + message;
    outputChannel.appendLine(message);
    console.log(message);
    return false;
};

export function outputError(error: SPGo.IError, outputChannel: vscode.OutputChannel) {
    //vscode.window.spgo.statusBarItem.text = 'SPGo: ' + error.message;
    outputChannel.appendLine('================================     ERROR     ================================\n');
    outputChannel.appendLine(error.message);
    console.error(error);
    return false;
};