# SPGo for Visual Studio Code

## Overview
SPGo allows you and your team to develop SharePoint web solutions from your local PC using the power of Visual Studio Code. Build SharePoint sites and customizations source-control first with all of the power of a top-tier IDE. Produce cleaner code, deliver faster.
* Publish files on save
* Pull down remote folders to your local workspace
* No more editors messing with your markup 
* Keep all project configuration in Source Control for easy team integration

## Features
* Manage multiple configurations
    * Configuration data is stored within the project directory and can be stored in source control
* Check out files from SharePoint
    * Check out current file using command `>SPGo: Check Out the current file`
    * Check out current file with the hotkey combo: `Alt+Shift+c`
* Publish files to SharePoint
    * Save|publish|check-in automatically on Save
    * Force publish using command `>SPGo: Publish the current file`
    * Publish a major version with the hotkey combo: `Alt+Shift+p`
    * Publish a minor version with the hotkey combo: `Alt+p`
    * Discard checkout using command `SPGo: Discard check out`
* Retrieve the contents of a specified folder from SharePoint
    * Enter a site-relative folder into the dialog to automatically download the contents
* Retrieve the contents of multiple folders from SharePoint (Synchronize)
    * Specify an array of site-relative folders in the `remoteFolders` configuration node
    * Download all subfolders automatically by using command `>SPGo: Populate workspace`


## Security
Credentials are stored in VSCode memory only. SPGo will only ask you for credentials the first time you sync with SharePoint each session.

## Configuration and Getting Started
To get started using SPGo, press `Ctrl+Shift+p` (Windows) `Cmd+Shift+p` (Mac) or open the Command Pallet and type `>SPGo: Configure workspace` to bring up the SPGo Configuration Wizard. Upon successful configuration, a new file will be created in the root of your project folder called `spgo.json`. From there, all files and folders created under the `src` folder in your local workspace will be deployed to their corresponding site-relative path your SharePoint site upon save.

## SPGo.json Configuration Files
If configuration was successful, you should see a file similar to below:

```json
{
    "sourceDirectory": "src",
    "workspaceRoot": "c:\\Users\\chris\\Code\\MyProject",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
} 
```

Additionally you can specify an array of remote folders in a node called `remoteFolders`, which SPGo will recursively downloaded to your local workspace when you issue the Synchronize Files command `SPGo: Populate Workspace`. Note: This WILL overwrite all local files.
```json
{
    "sourceDirectory": "src",
    "workspaceRoot": "c:\\Users\\chris\\Code\\MyProject",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
    "remoteFolders": [
        "/SiteAssets/MyProject/",
        "/_catalogs/wp/",
        "/_catalogs/masterpage/"
    ]
} 
```

## Use
SPGo will automatically launch when you run the Configure Workspace command `>SPGo: Configure workspace` or any time the SPGO Configuration file `spgo.json` is detected in the root of the current workspace.

## Roadmap
* [MVP] - Code cleanup, technical debt
* [1.1] - Remote File Compare. Merge updates from the server with your local source


## Issues
Please submit any issues or feature requests to [https://github.com/ReadySiteGo/SPGo/issues](https://github.com/ReadySiteGo/SPGo/issues) or, better yet, author a pull request.

## Open Source
This project is offered under the MIT open source license. Collaboration, contribution, and feedback is welcomed and encouraged!

## Thank You
I want to thank the following developers for inspiration and source packages:
* [John Nelson](https://github.com/celador): ForceCode author - example of a great VSCode IDE extension
* [Sergey Sergeev](https://github.com/s-KaiNet) : sp-request, spsave author
* [Andrew Koltyakov](https://github.com/koltyakov) : sppull author

## More about SiteGo
SiteGo is a SharePoint collaboration platform that enables you to simply and securely collaborate with partners, vendors and users outside your company. You can learn more here: [https://www.sitego.co](https://www.sitego.co).