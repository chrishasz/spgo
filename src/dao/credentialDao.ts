'use strict';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

import { Cpass } from 'cpass';
import { ICredential } from '../spgo';
import { Constants } from '../constants';
import { UrlHelper } from '../util/urlHelper';

export class CredentialDao {
    static getCredentials(name : string) : ICredential{
        const cpass = new Cpass();
        let fileName = UrlHelper.formatUriAsFileName(name);
        let credentialFilePath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER + path.sep + fileName + '.json';
        let retrievedCredentials : ICredential = fs.readJsonSync(credentialFilePath);

        retrievedCredentials.username = cpass.decode(retrievedCredentials.username);
        retrievedCredentials.password = cpass.decode(retrievedCredentials.password);
        
        if( retrievedCredentials.domain){
            retrievedCredentials.domain = cpass.encode(retrievedCredentials.domain)
        }

        return retrievedCredentials;
    }

    static setCredentials( name : string, credentials : ICredential){
        const cpass = new Cpass();
        let fileName = UrlHelper.formatUriAsFileName(name);
        let credentialFilePath : string = os.tmpdir() + path.sep + Constants.TEMP_FOLDER + path.sep + fileName + '.json';

        let storedCredentials : ICredential = {
            username : cpass.encode(credentials.username),
            password : cpass.encode(credentials.password)
        }

        if( credentials.domain){
            storedCredentials.domain = cpass.encode(credentials.domain)
        }

        fs.outputJsonSync(credentialFilePath, storedCredentials);
    }
}