'use strict';
import * as spRequest from 'sp-request';
import {
    IUserCredentials,
    IOnpremiseUserCredentials,
    IOnpremiseFbaCredentials,
    IAdfsUserCredentials
  } from 'node-sp-auth';

import {IAppManager} from './../spgo';
import {Constants} from './../constants';

export class RequestHelper {

    static createCredentials(appManager : IAppManager) : any {
        switch(appManager.config.authenticationType){
            case Constants.SECURITY_ADFS:{
                let credentials : IAdfsUserCredentials = {
                    password: appManager.credential.password,
                    username: appManager.credential.username,
                    relyingParty: appManager.config.authenticationDetails.relayingParty,
                    adfsUrl: appManager.config.authenticationDetails.adfsUrl
                };
                
                return credentials;
            }
            case Constants.SECURITY_DIGEST: {
                let credentials : IUserCredentials = {
                    password: appManager.credential.password,
                    username: appManager.credential.username
                };
                
                return credentials;
            }
            case Constants.SECURITY_FORMS: {
                let credentials : IOnpremiseFbaCredentials = {
                    password: appManager.credential.password,
                    username: appManager.credential.username,
                    fba: true
                  };
                
                return credentials;
            }
            case Constants.SECURITY_NTLM: {
                let credentials : IOnpremiseUserCredentials ;
                let parts : string[] = appManager.credential.username.split('\\');
                if (parts.length > 1) {
                    credentials = {
                        domain : parts[0],
                        password : appManager.credential.password,
                        username : parts[1]
                    }
                }
                
                return credentials;
            }
            default:{
                let credentials : IUserCredentials = {
                    password : appManager.credential.password,
                    username : appManager.credential.username
                };
                
                return credentials;
            }

        }
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