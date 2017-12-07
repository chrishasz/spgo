'use strict';
import * as vscode from 'vscode';
import * as SPGo from './../spgo';
import * as Colors from 'colors';

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

    // static outputMessage(error: SPGo.IError, outputChannel?: vscode.OutputChannel) {
    //     if(error && error.message){
    //         outputChannel = outputChannel || vscode.window.spgo.outputChannel;
    //         outputChannel.appendLine(error.message);
    //     }
    // };

    static outputWarning(message: string, outputChannel?: vscode.OutputChannel) {
        outputChannel = outputChannel || vscode.window.spgo.outputChannel;
        outputChannel.appendLine(Colors.yellow(message));
    }
    
    static outputError(error: SPGo.IError, outputChannel?: vscode.OutputChannel) {
        if(error && error.message){
            outputChannel = outputChannel || vscode.window.spgo.outputChannel;
            outputChannel.appendLine(Colors.red('================================     ERROR     ================================\n'));
            outputChannel.appendLine(Colors.red(error.message));
            outputChannel.appendLine(Colors.red('===============================================================================\n'));
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

