---
layout: page
title: Configuration Options
---

Listed below are all `spgo.json` configuration options, with explanations of their use.

## authenticationType

The `authenticationType` parameter lets you specify which type of authentication is used by SPGo. The most common types forms of authentication are `Digest`, supported by SharePoint Online/Office 365, and NTLM, supported by many on-premise SharePoint instances.

Options:

* ADFS
* Digest
* Forms
* NTLM V1
* NTLM V2
* Two-Factor

Read more: [Authentication Types](/spgo/authentication/overview)

## authenticationDetails

When using ADFS Authentication outside of Office 365, you will need to specify additional details in this node describing the ADFS url and relying party.

```json
    "authenticationDetails": {
        "relyingParty": "[relying party]",
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
* `SaveOnly` - Save a copy of the file to SharePoint, but do not publish

## publishWorkspaceGlobPattern

Provide an optional Glob pattern to SPGo to fine tune which files are published to SharePoint when the `SPGo> Publish Workspace` command is issued.

An example of this would be to specify a glob pattern such that only minified files are published to SharePoint when using a minification plugin with VSCode. In this scenario, it is recommended that you use a `publishingScope` of `None` should you wish to prevent unminified files from being deployed to SharePoint.

## remoteFolders

Define a set of folders to download to your local workspace any time the `SPGo> Populate local workspace` [command](/spgo/commands/populate-workspace) is used. Each entry in this array can use Glob formatting to further refine which files are downloaded to your local workspace.

## sharePointSiteUrl

The URL of the SharePoint site that you will be building customizations for. If you are hand-entering this value, it must always start with either `http://` or `https://`.

## storeCredentials

You will be prompted to enter credentials the first time you connect to SharePoint during your SPGo development session. Setting this property to true will allow SPGo to store your credentials locally from session to session, so that you do not need to reenter them every time you open VSCode.

Default Value: `true`

_note: all credentials are hashed and saved to your OS' local temp folder using [CPass](https://www.npmjs.com/package/cpass){:target="_blank"}, providing a modicum of security.
_note: SPGo can store unique credentials for each site collection you work with._

## subSites

If you share code and resources between a root site and multiple child sites, you can map multiple subsites to your source tree using the `subSites` node in `SPGo.json`.

You can find more detailed documentation on subSites config [here](/spgo/advanced/working-with-subsites).

``` json
{
    "subSites": [{
        "sharePointSiteUrl" : "https://tenant.sharepoint.com/sites/spgo/subsite",
        "remoteFolders": [
            "/SiteAssets/**/*"
        ]
    }]
}
```

## Example Complete spgo.json file

``` json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com",
    "publishingScope": "Minor",
    "publishWorkspaceGlobPattern" : "/**/*.min.*",
    "authenticationType": "ADFS",
    "authenticationDetails": {
        "relyingParty": "[relying party]",
        "adfsUrl": "[ADFS Url]"
    },
    "checkInMessage" : "Custom Publishing Message",
    "storeCredentials" : true,
    "remoteFolders": [
        "/siteAssets/*"
    ],
    "subSites": [{
        "sharePointSiteUrl" : "https://tenant.sharepoint.com/sites/site/subsite1",
        "remoteFolders": [
            "/SiteAssets/**/*"
        ]
    },{
        "sharePointSiteUrl" : "https://tenant.sharepoint.com/sites/site/subsite2",
        "remoteFolders": [
            "/Style Library/**/*"
        ]
    }]
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
    sourceDirectory? : string;
    storeCredentials? : Boolean;
    subSites? : ISubSite[];
    workspaceRoot? : string;
}
```
