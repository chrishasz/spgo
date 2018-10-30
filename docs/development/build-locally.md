---
layout: page
title: Github Integration
---

Building and running SPGo locally requires that you configure your host for VSCode plugin development. You will need the following tools installed:

* [Node.js](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

## Building and installing SPGo locally
1. globally install the vsce tools: `sudo npm install -g vsce`
2. get latest from master branch: 
    * `git clone https://github.com/readysitego/spgo`
3. get packages: `npm install`
4. Build and install package manually:
    * `vsce package`
    * `code --install-extension <package>.vsix` 
    where `<package>` is the name of the package generated in the step above.


## Building and installing SPGo locally from a specific branch
1. globally install the vsce tools: `sudo npm install -g vsce`
2. get latest from master branch: 
    * `git clone https://github.com/readysitego/spgo`
    * `git checkout <branch>`
    * `git pull`
3. get packages: `npm install`
4. Build and install package manually:
    * `vsce package`
    * `code --install-extension <package>.vsix` 
    where `<package>` is the name of the package generated in the step above.