---
layout: page
title: ADFS Authentication
---

ADFS authentication is commonly used by SharePoint Online (Office 365) or on-premise instances which are secured by a 3rd party IAM solution. Your username can take the format of an email address or a domain login when prompted for login credentials.

## Additional Configuration
To specify ADFS authentication, set the `authenticationType` property to `ADFS` in your `spgo.json` file, or by selecting the "ADFS" option when configuring your local environment with the `SPGO> Configure Workspace` command.
