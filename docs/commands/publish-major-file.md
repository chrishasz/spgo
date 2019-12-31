---
layout: page
title: Publish Major Version
---

## Command Name

`SPGo: Publish a major version of the current file`

## Description

Publish a major version of the current file to SharePoint. This command will perform the following actions:

- Check to see if the file is checked out. If not, the current file will be checked out
- Prompt the user for a publishing message
- A major version of the file will be published to the server, including the user-entered publishing message
- The file will be checked-in to SharePoint

_note: A default publishing message can be set using the `checkInMessage` parameter defined in the `spgo.json` [configuration file](/spgo/general/config-options#checkInMessage)._

### Advanced Usage

You can publish an entire folder at once, by left-clicking on the folder in the Visual Studio Code Explorer window and executing the `SPGo: Publish a major version of the current file` command.

## Available from

- Hotkey: `<alt>+<shift>+<p>`
- File Explorer Context Menu
- Visual Studio Code Command Window
