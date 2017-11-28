'use strict';
import * as spRequest from 'sp-request';
import {IAppManager} from './../spgo';

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
        if(appManager.credential.username.split('\\').length > 1){
            return {
                'X-RequestDigest': digest,
                "X-FORMS_BASED_AUTH_ACCEPTED": "f" 
            }
        }   
        return {
            'X-RequestDigest': digest
        }
    }

    static createRequest(appManager : IAppManager) : spRequest.ISPRequest {    
        return spRequest.create(this.createCredentials(appManager));
    }

}