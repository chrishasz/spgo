---
layout: page
title: Addin-only Authentication
---

Application Password authentication uses a code that gives an app or device permission to access your Office 365 account. This is a common workaround for accessing a SharePont site which has been secured with 2FA with a 3rd party app that does not yet support Multi-Factor authentication. Your username will take the format of an email address when prompted for login credentials.

## Additional Configuration

To specify Digest authentication, set the `authenticationType` property to `Digest` in your `spgo.json` file, or by selecting the "Digest" option when configuring your local environment with the `SPGO> Configure Workspace` command.

## Generating an Application Password
