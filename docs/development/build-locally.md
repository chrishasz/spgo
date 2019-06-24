---
layout: page
title: Build SPGo Locally
---

Building and running SPGo locally requires that you configure your host for VSCode plugin development. You will need the following tools installed:

* [Node.js](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

## Building and installing SPGo locally

1. globally install the vsce tools: `sudo npm install -g vsce`
2. get latest from master branch:
    * `git clone https://github.com/chrishasz/spgo`
3. get packages: `npm install`
4. Build and install package manually:
    * `vsce package`
    * `code --install-extension <package>.vsix`
    where `<package>` is the name of the package generated in the step above.

## Building and installing SPGo locally from a specific branch

1. globally install the vsce tools: `sudo npm install -g vsce`
2. get latest from master branch:
    * `git clone https://github.com/chrishasz/spgo`
    * `git checkout <branch>`
    * `git pull`
3. get packages: `npm install`
4. Build and install package manually:
    * `vsce package`
    * `code --install-extension <package>.vsix`
    where `<package>` is the name of the package generated in the step above.

## Building SPGo with Visual Studio Code

VSCode uses a combination of `launch.json` and `tasks.json` to enable f5 / debugging support for extensions. these files live in the project root, underneath a folder called `.vscode`. You may need to create this folder manually if it does not already exist. For more on VSCode's task system, check out the [documentation](https://code.visualstudio.com/docs/editor/tasks).

The files below work with the `package.json` file which is checked into the SPGo project Github.

### launch.json

``` json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "extensionHost",
            "request": "launch",
            "name": "Launch Extension",
            "runtimeExecutable": "${execPath}",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ],
            "outFiles": [
                "${workspaceFolder}/out/**/*.js"
            ],
            "preLaunchTask": "npm: compile"
        },
    ]
}
```

### tasks.json

``` json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "typescript",
            "tsconfig": "tsconfig.json",
            "problemMatcher": [
                "$tsc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```
