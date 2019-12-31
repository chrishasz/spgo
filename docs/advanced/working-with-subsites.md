---
layout: page
title: Working with SubSites
---

When building sites for SharePoint, it is common to have multiple sites below the Root Site Collection which integrate with the root site. These sites often share branding and code elements and behave as a single site collection.

The `subSites` node in the `spgo.json` config file lets SPGo be aware of which subsites you want to work with.

## Configuring SubSites

Working with subsites requires a single root node be added to your `spgo.json` config file.

### Configuration Element

The `subsite` node is a root element in the `spgo.json` file. It supports an array of SubSite objects, each of which has a required `sharePointSiteUrl` property and an optional array of `remoteFolders`. There is an example of a full `spgo.json` config file at the bottom of the [SPGo.json configuration options](/spgo/general/config-options#example) page.

This example below shows how to map a single SubSite. See here

``` json
{
    "subSites": [{
        "sharePointSiteUrl" : "https://tenant.sharepoint.com/sites/site/subsite1",
        "remoteFolders": [
            "/SiteAssets/**/*"
        ]
    }]
}
```

This example below shows how to map multiple SubSite.

``` json
{
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

And here is the object definition:

``` typescript
export interface ISubSite {
    remoteFolders? : string[];
    sharePointSiteUrl : string;
}
```

### Downloading Files

Once you have added the `subSite` node to your `SPGo.json` file, the most straight-forward way to pull the files to your local using the [Populate workspace](/spgo/commands/populate-workspace) command. By default, these files will live in the `src` directory, following a folder pattern mapped to the SharePoint site hierarchy.

Example:

A SharePoint site hierarchy of:

```ascii
   |
   |--root_site
   |  |
   |  |--subsite1
   |  |
   |  |--subsite2
```

would map to the following folder structure in your SPGo workspace:

```ascii
    |
    |--src
    |  |
    |  |--SiteAssets
    |  |  |
    |  |  |--main.js
    |  |  |
    |  |  |--main.css
    |  |
    |  |--subsite1
    |  |  |
    |  |  |--SiteAssets
    |  |     |
    |  |     |--main.js
    |  |
    |  |--subsite2
    |  |  |
    |  |  |--Style Library
    |  |  |
    |  |  |--main.css
```

Alternatively, as long as you have added the config entries to `SPGo.json`you can always create the folder structure locally within your `src` directory, and SPGo will automatically save/publish any files you create locally.

## Commands that work with SubSites

The following commands work within SubSites.

* [Check out a file](/spgo/commands/check-out-file)
* [Compare file with server](/spgo/commands/compare-with-server)
* [Delete file from server](/spgo/commands/delete-file)
* [Discard checkout](/spgo/commands/discard-checkout)
* [Populate workspace](/spgo/commands/populate-workspace)
* [Publish workspace](/spgo/commands/publish-workspace)
* [Publish a Major Version of a file](/spgo/commands/publish-major-file)
* [Publish a Minor Version of a file](/spgo/commands/publish-minor-file)
* [Retrieve folder](/spgo/commands/retrieve-folder)

## Caveats

* all subsites must belong to the same Site Collection.
