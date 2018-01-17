'use strict';
import * as vscode from 'vscode';
import * as SPGo from './../spgo';

export class Logger {
    
    static showError(message : string, error ?: SPGo.IError){
        vscode.window.showErrorMessage(message);
        this.outputError(error);
    }
    
    static showInfo(message : string, error?: SPGo.IError){
        vscode.window.showInformationMessage(message);
        if(error){
            this.outputMessage(error.message);
        }
    }
    
    static showWarning(message : string, error?: SPGo.IError){
        vscode.window.showWarningMessage(message);
        if(error){
            this.outputWarning(error.message);
        }
    }

    static outputMessage(message: string, outputChannel?: vscode.OutputChannel) {
        outputChannel = outputChannel || vscode.window.spgo.outputChannel;
        outputChannel.appendLine(message);
    }

    static outputWarning(message: string, outputChannel?: vscode.OutputChannel) {
        outputChannel = outputChannel || vscode.window.spgo.outputChannel;
        outputChannel.appendLine(message);
    }
    
    static outputError(error: SPGo.IError, outputChannel?: vscode.OutputChannel) {
        if(error && error.message){
            outputChannel = outputChannel || vscode.window.spgo.outputChannel;
            outputChannel.appendLine('================================     ERROR     ================================\n');
            outputChannel.appendLine(error.message);
            outputChannel.appendLine('===============================================================================\n');
        }
    }

    static updateStatusBar(message: string, duration? : number) : void{
        this.outputMessage(message);
        
        vscode.window.spgo.statusBarItem.text = message;
        if(duration){
            global.setTimeout(() => {vscode.window.spgo.statusBarItem.text = "";}, duration * 1000);
        }
    }
}

