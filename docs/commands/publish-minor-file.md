---
layout: page
title: Publish Minor Version
---

## Command Name
`SPGo: Publish a minor version of the current file`

## Description
Publish a minor version of the current file to SharePoint. This command will perform the following actions:
- Check to see if the file is checked out. If not, the current file will be checked out
- Prompt the user for a publishing message
- A minor version of the file will be published to the server, including the user-entered publishing message
- The current file check-out will be preserved

_note: A default publishing message can be set using the `checkInMessage` parameter defined in the `spgo.json` [configuration file](/spgo/general/config-options)._

### Advanced Usage
You can publish an entire folder at once, by left-clicking on the folder in the Visual Studio Code Explorer window and executing the `SPGo: Publish a major version of the current file` command.

## Available from
* Hotkey: <alt>+<p>
* File Explorer Context Menu
* Visual Studio Code Command Window
