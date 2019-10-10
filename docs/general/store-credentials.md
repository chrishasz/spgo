---
layout: page
title: Store Credentials
---
If you want to store your SharePoint credentials locally so that you do not need to reenter every time you use SPGo, you can set the `storeCredentials` property in the `spgo.json` config file to `true`. You will be prompted to enter credentials the first time you connect to SharePoint during your SPGo development session.

_note 1: all credentials are hashed and saved to your OS' local temp folder using [CPass](https://www.npmjs.com/package/cpass), providing a modicum of security._

_note 2: SPGo can store unique credentials for each site collection you work with._

## Example Complete spgo.json file with credential storing enabled

``` json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com",
    "publishingScope": "PublishMinor",
    "authenticationType": "Digest",
    "storeCredentials" : true,
    "remoteFolders": [
        "/siteAssets/"
    ]
}
```

Read about other configuration options [here](/spgo/general/config-options).
