'use strict';
import * as vscode from 'vscode';

export class Logger {
    
    static showError(message : string, error ?: any){
        
        vscode.window.showErrorMessage(message);
        this.outputError(error);
    }
    
    static showInfo(message : string, error?: any){
        
        vscode.window.showInformationMessage(message);
        this.outputMessage(message);
        if(error){
            this.outputMessage(error.message);
        }
    }
    
    static showWarning(message : string, error?: any){
        
        vscode.window.showWarningMessage(message);
        this.outputWarning(message);
        if(error){
            this.outputWarning(error.message);
        }
    }

    static outputMessage(message: string, outputChannel?: vscode.OutputChannel) {
        
        outputChannel = outputChannel || vscode.window.spgo.outputChannel;
        this.formatOutputMessage(message, outputChannel);
    }

    static outputWarning(message: string, outputChannel?: vscode.OutputChannel) {
        
        outputChannel = outputChannel || vscode.window.spgo.outputChannel;
        this.formatOutputMessage(message, outputChannel);
    }
    
    static outputError(error: any, outputChannel?: vscode.OutputChannel) {
        
        if(error){
            outputChannel = outputChannel || vscode.window.spgo.outputChannel;
            this.formatOutputMessage('================================     ERROR     ================================\n', outputChannel);
            if(error.message){
                this.formatOutputMessage(error.message, outputChannel);
            }
            this.formatOutputMessage('Error Detail:', outputChannel);
            this.formatOutputMessage('----------------------', outputChannel);
            this.formatOutputMessage(error, outputChannel);
            this.formatOutputMessage('===============================================================================\n', outputChannel);
        }
    }

    static formatOutputMessage(message : string, outputChannel?: vscode.OutputChannel) : void{
        
        outputChannel.appendLine(`[${ new Date(Date.now()).toLocaleString() }] ${message}`);
    }

    static updateStatusBar(message: string, duration? : number) : void{
        this.outputMessage(message);
        
        vscode.window.spgo.statusBarItem.text = message;
        if(duration){
            global.setTimeout(() => {vscode.window.spgo.statusBarItem.text = '';}, duration * 1000);
        }
    }
}

