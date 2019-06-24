---
layout: page
title: Software Development Life Cycle
---

Building SharePoint solutions with VSCode and SPGo follows common practices for software development. Generally, code is authored directly against development instances of SharePoint only. Code deployments to PPE and Production environments should be automated as much as possible using tools such as gulp and supporting libraries like [spsave](https://www.npmjs.com/package/spsave) ([GitHub](https://github.com/s-KaiNet/spsave))

## Development Environment

Working in a development environment with SPGo is similar to using other IDEs such as SharePoint designer. Code is authored in VSCode with SPGo, and either automatically or manually published to SharePoint. The major difference is that all files will also live on your local host so that they can be committed to source control.

For more information see [working with source control](/spgo/advanced/github-integration).

## PreProduction (PPE) and Production Environments

In order to ensure consistent deployments to PPE and production environments, we recommend that you use a task-based build tool such as `gulp` to fetch, minify, and deploy builds. Authoring code directly against PPE and production environments is considered bad practice and should be avoided (even if the author has done this before once or twice!).

VSCode supports the ability to run gulp tasks from the command line using the built-in terminal window.

## Recommended Tools

* NPM - Manage node packages
* Gulp - Task-based build tool available on NPM
* SPSave - Node library for uploading files to SharePoint
* SPPurge - Node library for deleting unused files from SharePoint
