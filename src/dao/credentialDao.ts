'use strict';

import * as fs from 'fs-extra';
import * as vscode from 'vscode';

import { Cpass } from 'cpass';
import { ICredential } from '../spgo';
import { Logger } from '../util/logger';

export class CredentialDao {

    static deleteCredentials(name : string){
        fs.removeSync(name);
    }

    static getCredentials(name : string) : ICredential{
        const cpass = new Cpass();
        let retrievedCredentials : ICredential = null;

        try{
            retrievedCredentials = vscode.window.spgo.localStore.getCredentials(name)

            retrievedCredentials.username = cpass.decode(retrievedCredentials.username);
            retrievedCredentials.password = cpass.decode(retrievedCredentials.password);
            
            if( retrievedCredentials.domain){
                retrievedCredentials.domain = cpass.encode(retrievedCredentials.domain)
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
            username : cpass.encode(credentials.username),
            password : cpass.encode(credentials.password)
        }

        if( credentials.domain){
            storedCredentials.domain = cpass.encode(credentials.domain)
        }
        
        vscode.window.spgo.localStore.setCredentials(name, storedCredentials)
    }
}