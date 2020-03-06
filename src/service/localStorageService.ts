'use strict';

import { Memento } from "vscode";
import { ICredential } from "../spgo";


export class LocalStorageService {
    
    constructor(private storage: Memento) { }   
    
    public getCredentials(key : string) : ICredential{
        return this.storage.get<ICredential>(key, null);
    }

    public setCredentials(key : string, creds : ICredential){
        this.storage.update(key, creds );
    }
}
