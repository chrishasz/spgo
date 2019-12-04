'use strict';
import * as vscode from 'vscode';

import {IError} from './../spgo';
import {Logger} from '../util/logger';

export class ErrorHelper{

    static handleError(err, suppressError? : Boolean){

        if(suppressError){
            Logger.outputError(err, vscode.window.spgo.outputChannel);
        }
        else{
            //HACK: Come up with a better way to detect if this error was due to credentials
            if(err.message && (err.message.indexOf('wst:FailedAuthentication') >= 0 || err.message.indexOf('Unable to resolve namespace authentication type') >= 0)){
                vscode.window.spgo.credentials = null;
                let error : IError ={
                    message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
                };
                Logger.showError(error.message, err);
            }
            //otherwise something else happened.
            else{
                if(err.message && err.message.value){
                    Logger.showError(err.message.value, err);
                }
                // log sharepoint errors
                else if(err.error && err.error.error ){
                    Logger.showError(err.error.error.message.value, err.error.error);
                }
                else{
                    Logger.outputError(err, vscode.window.spgo.outputChannel);
                }
            }  
        }
        
    }

    // static handleErrorSilently(err, reject){
    //     this.handleError(err, reject, Logger.outputError);
    // }
}