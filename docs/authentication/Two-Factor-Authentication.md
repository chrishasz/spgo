---
layout: post
title: Two-factor Authentication
---

Two-factor authentication is commonly used by SharePoint Online (Office 365). VisualStudio does not (yet!) support interacting with the underlying electron browser to request/read headers from an external site, so users who author SharePoint solutions will need to create a unique Application ID and Password for each Site they work on.

Your username will take the format of an email address when prompted for login credentials.

## Additional Configuration
To use an Application Id with two-factor authentication, set the `authenticationType` property to `Digest` in your `spgo.json` file, or by selecting the "Digest" option when configuring your local environment with the `SPGO> Configure Workspace` command.

## Generating an App Id and Password