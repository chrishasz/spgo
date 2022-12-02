'use strict';
import * as vscode from 'vscode';

import {IError} from './../spgo';
import {Logger} from '../util/logger';

export class ErrorHelper{

    static handleError(err : any, suppressError? : Boolean){

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
            //The file was locked
            else if(err.message === 'Response code 423 (Locked)'){
                Logger.showError('This file is not checked out to you. Please check out the file before editing.');
                Logger.outputMessage(`File: ${err.response.requestUrl}`);
                Logger.outputError(err);
                err.response.requestUrl
            }
            //otherwise something else happened.
            else{
                if(err.message && err.message.value){
                    Logger.showError(err.message.value, err);
                }
                // log sharepoint errors
                else if(err.error && err.error.error ){
                    Logger.showError(err.error.error.message.value, err);
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
