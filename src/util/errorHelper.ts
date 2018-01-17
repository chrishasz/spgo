'use strict';
import * as vscode from 'vscode';

import {IError} from './../spgo';
import {Logger} from '../util/logger';

export class ErrorHelper{

    static handleHttpError(err, reject, outputMethod?){
        outputMethod = outputMethod || Logger.showError;

        //HACK: Come up with a better way to detect if this error was due to credentials
        if(err.message && err.message.indexOf('wst:FailedAuthentication') > 0){
            vscode.window.spgo.credential = null;
            let error : IError ={
                message : 'Invalid user credentials. Please reset your credentials via the command menu and try again.' 
            };
            Logger.outputError(error, vscode.window.spgo.outputChannel);
        }
        //otherwise something else happened.
        else{
            if(err.message && err.message.value){
                outputMethod(err.message.value, err);
            }
            // log sharepoint errors
            else if(err.error && err.error.error ){
                outputMethod(err.error.error.message.value, err);
            }
            else{
                Logger.outputError(err, vscode.window.spgo.outputChannel);
            }
        }
        
        reject(err);
    }

    static handleHttpErrorSilently(err, reject){
        this.handleHttpError(err, reject, Logger.outputError);
    }
}