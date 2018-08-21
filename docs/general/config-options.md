---
layout: page
title: Configuration Options
---

Listed below are all `spgo.json` configuration options, with explainations of their use.

## authenticationType
The `authenticationType` parameter lets you specify which type of authentication is used by SPGo. The most common types forms of authentication are `Digest`, supported by SharePoint Online/Office 365, and NTLM, supported by many on-premise SharePoint instances.

Options:
* Digest
* NTLM V1
* Forms
* ADFS

Read more: [Authentication Types](https://github.com/readysitego/spgo/wiki#authentication)

## authenticationDetails
When using ADFS Authentication, you will need to specify additional details in this node describing the ADFS url and relaying party.

```json
    "authenticationDetails": {
        "relayingParty": "[relaying party]",
        "adfsUrl": "[ADFS Url]"
    }
```
## checkInMessage
Set the default check-in message which is used any time you publish a major or minor version of a file to SharePoint. You will still be able to input a unique message each time you publish a file.

## publishingScope
Define which action SPGo will take when a file is saved in SPGo (either `<ctrl>+s` or via `file->save` menu).

Options:
* `None` - Take no action when a file is saved
* `PublishMajor` - Publish a major version of the file on save
* `PublishMinor`- Publish a minor version of the file on save
* `SaveOnly` - Save a copy of the file to SharPoint, but do not publish

## publishWorkspaceGlobPattern
Provide an optional Glob pattern to SPGo to fine tune which files are published to SharePoint when the `SPGo> Publish Workspace` command is issued.

An example of this would be to specify a glob pattern such that only minified files are published to SharePoint when using a minification plugin with VSCode. In this scenario, it is recommended that you use a `publishingScope` of `None` should you wish to prevent unminified files from being deployed to SharePoint.

## remoteFolders
Define a set of folders to download to your local workspace any time the `SPGo> Populate local workspace` [command](/spgo/commands/populate-workspace) is used. Each entry in this array can use Glob formatting to further refine which files are downloaded to your local workspace.

## sharePointSiteUrl
The URL of the SharePoint site that you will be building customizations for. If you are hand-entering this value, it must always start with either `http://` or `https://`.

## storeCredentials
You will be prompted to enter credentials the first time you connect to SharePoint during your SPGo development session. Setting this property to true will allow SPGo to store your credentials locally from session to session, so that you do not need to reenter them every time you open VSCode.

_note: all credentials are hashed and saved to your OS' local temp folder using [CPass](https://www.npmjs.com/package/cpass), providing a modicum of security.

## Example Complete spgo.json file
``` json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://sitego.sharepoint.com",
    "publishingScope": "PublishMinor",
    "publishWorkspaceGlobPattern" : "/**/*.min.*",
    "authenticationType": "ADFS",
    "authenticationDetails": {
        "relayingParty": "[relaying party]",
        "adfsUrl": "[ADFS Url]"
    },
    "checkInMessage" : "Custom Publishing Message",
    "storeCredentials" : true,
    "remoteFolders": [
        "/siteAssets/"
    ]
}
```

## SPGo Configuration Object Definition
``` typescript
export interface IConfig{
    authenticationType? : string;
    authenticationDetails? : any;
    checkInMessage? : string,
    publishingScope? : string;
    publishWorkspaceGlobPattern? : string;
    remoteFolders? : string[];
    sharePointSiteUrl? : string;
    storeCredentials? : Boolean;
    workspaceRoot? : string;
}
```
