'use strict';
import * as vscode from 'vscode';
import {IPublishingAction} from './../spgo';

export class UiHelper{
    
    static getPublishingMessage(publishingInfo : IPublishingAction) : Thenable<any> {
        let options: vscode.InputBoxOptions = {
            ignoreFocusOut: true,
            placeHolder: publishingInfo.message,
            value: publishingInfo.message,
            prompt: 'Please enter an optional publishing message',
        };
        
        return vscode.window.showInputBox(options).then(result => {
            publishingInfo.message = result || publishingInfo.message;

            return publishingInfo;
        });
    }
    
    static showStatusBarProgress(message : string, action : Promise<any>) : Thenable<any>{
        
        let options : vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Window, 
            title: message
        }
    
        return vscode.window.withProgress(options, 
            async () => {
                return action;
            }
        );
    }
}