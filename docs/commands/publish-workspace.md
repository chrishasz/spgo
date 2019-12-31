---
layout: page
title: Publish Local Workspace
---

## Command Name

`SPGo: Publish Local Workspace`

## Description

Publish a major version of all files in the `src` folder to SharePoint. A publishing message can be entered. The set of files published to the server can be further refined by specifying a [glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)){:target="_blank"} in the `publishWorkspaceOptions` parameter in the `spgo.json` [configuration file](/spgo/general/config-options#publishWorkspaceOptions).

_note: A default publishing message can be set using the `checkInMessage` parameter defined in the `spgo.json` [configuration file](/spgo/general/config-options#checkInMessage)._

### Advanced Usage

Please see the documentation for [advanced publishing scenarios](/spgo/advanced/publishing-workspace).

## Available from

* File Explorer Context Menu
* Visual Studio Code Command Window
