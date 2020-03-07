---
layout: page
title: Populate Workspace
---

## Command Name

`SPGo: Populate Workspace`

## Description

Populate your local workspace from the latest on the server. Use the `remoteFolders` parameter defined in the `spgo.json` [configuration file](/spgo/general/config-options#remoteFolders) to manage which files are downloaded from the server 
when this command is run.

### Inputs Accepted

* A relative folder url
* A glob pattern defining multiple files or folders
* a specific file url

### Example

```json
{
    "remoteFolders": [
        "/siteAssets/**/*",
        "/Style Library/main.css"
    ],
}
```

_note: This command *will* overwrite any local changes._

## Available from

* Visual Studio Code Command Window
