'use strict';

import * as vscode from 'vscode';

import { Cpass } from 'cpass';
import { ICredential } from '../spgo';
import { Logger } from '../util/logger';

export class CredentialDao {

    static deleteCredentials(name : string){
        vscode.window.spgo.localStore.setValue<ICredential>(name, null);
    }

    static getCredentials(name : string) : ICredential{

        const cpass = new Cpass();
        let retrievedCredentials : ICredential = null;

        try{
            retrievedCredentials = vscode.window.spgo.localStore.getValue<ICredential>(name)

            if(retrievedCredentials){
                retrievedCredentials.username = retrievedCredentials.username ? cpass.decode(retrievedCredentials.username) : null;
                retrievedCredentials.password = retrievedCredentials.password ? cpass.decode(retrievedCredentials.password) : null;
                retrievedCredentials.clientId = retrievedCredentials.clientId ? cpass.decode(retrievedCredentials.clientId) : null;
                retrievedCredentials.clientSecret = retrievedCredentials.clientSecret ? cpass.decode(retrievedCredentials.clientSecret) : null;
                retrievedCredentials.realm = retrievedCredentials.realm ? cpass.decode(retrievedCredentials.realm) : null;
                retrievedCredentials.domain = retrievedCredentials.domain ? cpass.decode(retrievedCredentials.domain) : null;
            }
        }
        catch(err){
            Logger.outputError(err);
        }

        return retrievedCredentials;
    }

    
    static setCredentials( name : string, credentials : ICredential){

        const cpass = new Cpass();

        let storedCredentials : ICredential = {
            username : credentials.username ? cpass.encode(credentials.username) : null,
            password : credentials.password ? cpass.encode(credentials.password) : null,
            clientId : credentials.clientId ? cpass.encode(credentials.clientId) : null,
            clientSecret : credentials.clientSecret ? cpass.encode(credentials.clientSecret) : null,
            realm : credentials.realm ? cpass.encode(credentials.realm) : null,
            domain : credentials.domain ? cpass.encode(credentials.domain) : null
        }
        
        vscode.window.spgo.localStore.setValue<ICredential>(name, storedCredentials)
    }
}