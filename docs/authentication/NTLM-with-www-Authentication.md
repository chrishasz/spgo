---
layout: page
title: NTLM (with www) Authentication
---

Similar to standard NTLM authentication, NTLM with www-auth authentication is commonly used in corporate and on-premise SharePoint instances. Your username will be formatted as a domain login (e.g. `domain\username`) when prompted for login credentials.

SPGo will automatically create the correct headers to enable www-auth.

## Additional Configuration
To specify NTLM with www-auth authentication, set the `authenticationType` property to `NTLM` in your `spgo.json` file, or by selecting the "NTLM" option when configuring your local environment with the `SPGO> Configure Workspace` command.
