'use strict';
import * as spRequest from 'sp-request';

import {IAppManager} from './../spgo';
import Constants from './../constants';

export class RequestHelper {

    static createCredentials(appManager : IAppManager) : any {
        let credentials = {
            password: appManager.credential.password,
            username: appManager.credential.username,
            domain: null
        };

        let parts = appManager.credential.username.split('\\');
        if (parts.length > 1) {
            credentials.domain = parts[0];
            credentials.username = parts[1];
        }
        else{
            appManager.credential.username
        }

        return credentials;
    }

    static createHeaders(appManager : IAppManager, digest : string) : any { 

        let headers : any = {};

        if( Constants.SECURITY_NTLM == appManager.config.authenticationType){
            process.env['_sp_request_headers'] = JSON.stringify({
                'X-FORMS_BASED_AUTH_ACCEPTED': 'f'
            });
            headers['X-RequestDigest'] = digest
        }
        else if( Constants.SECURITY_DIGEST == appManager.config.authenticationType){
            headers['X-RequestDigest'] = digest
        }

        return headers;

        // if(appManager.credential.username.split('\\').length > 1){
        //     return {
        //         'X-RequestDigest': digest,
        //         "X-FORMS_BASED_AUTH_ACCEPTED": "f" 
        //     }
        // }   
        // return {
        //     'X-RequestDigest': digest
        // }
    }

    static createRequest(appManager : IAppManager) : spRequest.ISPRequest {
        return spRequest.create(this.createCredentials(appManager));
    }

    static setNtlmHeader(){
        process.env['_sp_request_headers'] = JSON.stringify({
            'X-FORMS_BASED_AUTH_ACCEPTED': 'f'
        });
    }
}