'use strict';

import * as spRequest from 'sp-request';
// import {
//     IUserCredentials,
//     IOnpremiseUserCredentials,
//     IOnpremiseFbaCredentials,
//     IAdfsUserCredentials
//   } from 'node-sp-auth';

import {IAppManager, IConfig} from './../spgo';
import {Constants} from './../constants';

export class RequestHelper {

    static createCredentials(appManager : IAppManager, config : IConfig) : any {
        switch(config.authenticationType){
            
            case Constants.SECURITY_ADDIN:{
                let credentials = {
                    clientId: appManager.credentials.clientId,
                    clientSecret: appManager.credentials.clientSecret,
                    realm: appManager.credentials.realm,
                };

                return credentials;
            }
            case Constants.SECURITY_ADFS:{
                let credentials = {
                    password: appManager.credentials.password,
                    username: appManager.credentials.username,
                    relyingParty: config.authenticationDetails.relyingParty,
                    adfsUrl: config.authenticationDetails.adfsUrl
                };
                
                return credentials;
            }
            case Constants.SECURITY_DIGEST: {
                let credentials = {
                    password: appManager.credentials.password,
                    username: appManager.credentials.username
                };
                
                return credentials;
            }
            case Constants.SECURITY_FORMS: {
                let credentials = {
                    password: appManager.credentials.password,
                    username: appManager.credentials.username,
                    fba: true
                  };
                
                return credentials;
            }
            case Constants.SECURITY_NTLM: {
                let credentials = null ;
                let parts : string[] = appManager.credentials.username.split('\\');
                if (parts.length > 1) {
                    credentials = {
                        domain : parts[0],
                        password : appManager.credentials.password,
                        username : parts[1]
                    }
                }
                
                return credentials;
            }
            default:{
                let credentials = {
                    password : appManager.credentials.password,
                    username : appManager.credentials.username
                };
                
                return credentials;
            }
        }
    }

    static createAuthHeaders(config : IConfig, digest : string, additionalHeaders? : any) : any { 

        let headers : any = additionalHeaders || {};

        if( Constants.SECURITY_NTLM == config.authenticationType || Constants.SECURITY_DIGEST == config.authenticationType){
            headers['X-RequestDigest'] = digest
        }

        return headers;
    }

    static createRequest(appManager : IAppManager, config : IConfig) : spRequest.ISPRequest {
        if( Constants.SECURITY_NTLM == config.authenticationType){
            process.env['_sp_request_headers'] = JSON.stringify({
                'X-FORMS_BASED_AUTH_ACCEPTED': 'f'
            });
        }

        return spRequest.create(this.createCredentials(appManager, config));
    }

    static setNtlmHeader(config : IConfig){
        if( Constants.SECURITY_NTLM == config.authenticationType){
            process.env['_sp_request_headers'] = JSON.stringify({
                'X-FORMS_BASED_AUTH_ACCEPTED': 'f'
            });
        }
    }
}