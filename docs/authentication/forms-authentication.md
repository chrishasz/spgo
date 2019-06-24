---
layout: page
title: Forms Authentication
---

Forms authentication is commonly used by internal SharePoint instances which are visible on the internet, such as Extranets and shared project sites. Your username will take the format of an email address when prompted for login credentials.

## Additional Configuration

To specify Digest authentication, set the `authenticationType` property to `Forms` in your `spgo.json` file, or by selecting the "Forms" option when configuring your local environment with the `SPGO> Configure Workspace` command.
