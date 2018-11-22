---
layout: page
title: Getting Started
---

## TL;DR, a Video!
{% include youtubePlayer.html id="de2txBruxfA" %}

*SPGo configuration in Visual Studio Code, by [David Warner](https://twitter.com/DavidWarnerII) of [Warner Digital](http://warner.digital/)*

When you build SharePoint customizations using SPGo, all files are stored locally. This is for two primary reasons:
1. We believe in building solutions source-code first and that all source code should live in an SCM tool.
2. Many high or medium-latency situations can cause a poor developer experience when interacting directly with the server for file customization.

This is in alignment with how most enterprise software is built, but can be at odds with how developers, especially those familiar with SharePoint Designer, are used to working.

## Getting Started
To get started using SPGo, you must first create a folder on your local PC to hold your custom files and folders for this project.

Once you have created a local folder, open this folder in Visual Studio Code and press `Ctrl+Shift+p` (Windows) `Cmd+Shift+p` (Mac) or open the Command Pallet and type `>SPGo: Configure Workspace` to bring up the SPGo Configuration Wizard. Upon successful configuration, a new file will be created in the root of your project folder called `spgo.json` and customizations within the `sourceDirectory` will be published to SharePoint. 

Example default `spgo.json` file:
```json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
    "authenticationType": "Digest"
} 
```
_note: for more on the `publishingScope` property and how to control when a file is synchronized with SharePoint, please see documentation [here](/spgo/general/synchronizing-files-with-sharepoint)_

You are now ready to start building SharePoint solutions with SPGo.

### Working with a New SharePoint Site
As you create files and folders inside your `src` directory, they will be synchronized with SharePoint, either when you save the files, or when you issue the `SPGo> Publish Workspace` command. See [this page](/spgo/general/synchronizing-files-with-sharepoint) for more details on publishing files.


### Working with an existing SharePoint Site
To work with a SharePoint site where custom files and content has been deployed, you will want to first synchronize all existing custom files (html, css, JavaScript, etc.) to your local workspace. This can be done a folder at a time using the `SPGo> Retrieve folder` command, or multiple folders using the `SPGo> Retrieve Folder` command.

To use the `SPGo: Retrieve Folder` command, you must also specify an array of remote folders with the property name `remoteFolders`, inside your `spgo.json` configuration file which is located at the root of your local workspace.

Example `spgo.json` file which will retrieve all files and folders from the SiteAssets folder, all files directly under the `/_catalogs/wp/` folder and all pages with the file extension `.master` under the `/_catalogs/masterpage/` folder:
```json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
    "authenticationType": "Digest",
    "remoteFolders": [
        "/SiteAssets/**/*",
        "/_catalogs/wp/",
        "/_catalogs/masterpage/*.master"
    ]
} 
```

_note: SPGo uses Glob notation for all file download functions_