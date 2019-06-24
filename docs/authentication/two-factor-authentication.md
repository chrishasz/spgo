---
layout: page
title: Two-factor Authentication
---

Two-factor authentication is commonly used by SharePoint Online (Office 365). VisualStudio does not (yet!) support interacting with the underlying electron browser to request/read headers from an external site, so users who author SharePoint solutions will need to create a unique Application ID and Password for each Site they work on.

Your username will take the format of an email address when prompted for login credentials.

## Additional Configuration

To use an Application Id with two-factor authentication, set the `authenticationType` property to `Digest` in your `spgo.json` file, or by selecting the "Digest" option when configuring your local environment with the `SPGO> Configure Workspace` command.

## Generating an Application Password

_from the docs..._

An app password is a code that gives an app or device permission to access your Office 365 account.

If your admin has turned on multi-factor authentication for your organization, and you're using apps that connect to your Office 365 account, you'll need to generate an app password so the app can connect to Office 365. For example, if you're using Outlook 2016 or earlier with Office 365, you'll need to create an app password.

You can [Learn more Here](https://support.office.com/en-us/article/create-an-app-password-for-office-365-3e7c860f-bda4-4441-a618-b53953ee1183)
