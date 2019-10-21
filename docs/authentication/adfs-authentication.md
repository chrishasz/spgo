---
layout: page
title: ADFS Authentication
---

ADFS authentication is commonly used by SharePoint Online (Office 365) or on-premise instances which are secured by a 3rd party IAM solution. Your username can take the format of an email address or a domain login when prompted for login credentials.

## Additional Configuration

To specify ADFS authentication, set the `authenticationType` property to `ADFS` in your `spgo.json` file, or by selecting the "ADFS" option when configuring your local environment with the `SPGO> Configure Workspace` command.

When using ADFS Authentication outside of Office 365, you will need to specify additional details in this node describing the ADFS url and relying party.

```json
    "authenticationDetails": {
        "relyingParty": "[relying party]",
        "adfsUrl": "[ADFS Url]"
    }
```
