---
layout: page
title: Synchronize Files
---

You can synchronize files to SharePoint using the following methods:

## Saving a File in Visual Studio Code
SPGo supports three optional actions for when you save (`<ctrl>+s` or file->save) a local file:
* Publish a major version of the file to SharePoint
* Publish a minor version of the file to SharePoint
* Save a copy of the file to SharePoint, but do not publish a major or Minor version.

You can configure, or reconfigure, which method is used by running the `SPGo> Configur Workspace` command.

## Publishing a File using Commands
Using the context menu items when you right-click on a file in your local workspace, you can chose to publish a major or minor version of your file to SharePoint. Publish a Major or Minor version of the currently open file is possible using the `<alt> + <shift> + p` and `<alt> + p` hotkeys.

## Publishing your full workspace
You can publish all folders within your local workspace using the command `>SPGo: Publish local Workspace`. This command will publish a Major version of each file within the `src` folder of your local workspace to SharePoint.