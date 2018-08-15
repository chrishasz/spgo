---
layout: page
title: Github Integration
---

SPGo was designed from the beginning to be a code-first and source-first tool for building SharePoint web solutions. Below are outlines for two common delivery scenarios: The first example shows how to use GitHub repo for one or more developers with their own SharePoint development environments. The second describes a collaborative approach where two ore more developers share a single SharePoint environment. Github useage is very similar across both of these scenarios, with configuration management (`spgo.json`) being the key differentiator.

_This is not a general GitHub tutorial, but there may be opinions ahead!_

## Solo Development Environment
In this scenario we have:
* A single, Shared Github repo
* Multiple development environments - one for each developer
* Possibly multiple SharePoint farms 
* Multiple `spgo.json` configuration files

### Getting Started
To start a new project, a new repo on GitHub should be initialized.
Once the repo has been initialized, each developer will issue a `git pull` command to get the latest from the current development branch (or create a new development branch) to a folder on their local machine. From there, the developer will open the root project folder, created by git, in VSCode and run the `SPGO> Configure Workspace` command to initialize the `spgo.json` configuration file. Remember to point to your specific development environment when specifying the `sharePointSiteUrl`

**Major Difference:** When working with individual development environments, it is recommended that you add an entry for `spgo.json` to your `.gitignore` file. This will prevent your local site configuration from conflicting with other developers. As a scalable approach, you should add an example `spgo.json` file to the repo's `readme.md` file so that developers can quickly amend their local config to match shared entries that the team will use.

### Buliding Features
If the SPGo project has already been initialized, you should have a basic folder structure in place. From here, development is pretty standard. Build your solution using SPGo, verify your changes in your development SharePoint environment and then commit your code to GitHub when the feature has been tested and is ready for QA/Customer sign-off.

### Example spgo.json Config
``` json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tennant.sharepoint.com/sites/myDevSite",
    "publishingScope": "SaveOnly",
    "authenticationType": "Digest",
    "remoteFolders": [
        "/siteassets/**/*",
        "/_catalogs/Masterpage/*",
        "/_catalogs/wp/*"
    ]
}
```
_note: `publishingScope` can be set to `PublishMajor` or `PublishMinor` for any site with Publishing enabled, allowing non-administrator users to view changes._


## Collaborating in a Shared Environment
In this scenario we have:
* A single, shared, Github repo
* A single development or integration environment, shared across all developers
* A single, shared, `spgo.json` config file. 

### Getting Started
To start a new project, a new repo on GitHub should be initialized.
Once the repo has been initialized, each developer will issue a `git pull` command to get the latest from the current development branch (or create a new development branch) to a folder on their local machine. From there, the developer will open the root project folder, created by git, in VSCode and run the `SPGO> Configure Workspace` command to initialize the `spgo.json` configuration file. Remember to point to your shared integration environment when specifying the `sharePointSiteUrl`. In this scenario all developers

**Major Difference:** When working in a shared environment, it is a strong recommendation that you always use SharePoint's publishing infrastructure to ensure that conflicts are minimized. SPGo will automatically detect changes between your local file and the server file when you issue the `SPGO> Check out File` command and present you with the VSCode compare window. GitHub will act as a secondary control to prevent conflicting changes from overwriting eachother when committing code.

### Buliding Features
If the SPGo project has already been initialized, you should have a basic folder structure in place. From here, development is pretty standard. Build your solution using SPGo, verify your changes in your shared environment and then commit your code to GitHub when the feature has been tested and is ready for QA/Customer sign-off.

### Example spgo.json Config
``` json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tennant.sharepoint.com",
    "publishingScope": "PublishMajor",
    "authenticationType": "Digest",
    "remoteFolders": [
        "/siteassets/**/*",
        "/_catalogs/Masterpage/*",
        "/_catalogs/wp/*"
    ]
}
```

_recommendation: it may be easier for a single developer to intiialize the repo and create a base `spgo.json` file. This will ensure that everyone on the team has the same config, file hierarchy, and will minimize the chance of ending up in merge-hell._


##Further Reading
For multi-stage environments, such as dev->test->prod, please see: [SPGo and SDLC](https://github.com/readysitego/spgo/wiki/SPGo-and-SDLC)