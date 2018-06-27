SPGo for Visual Studio Code
===
SPGo allows you and your team to develop SharePoint web solutions from your local PC using the power of Visual Studio Code. Now you can build SharePoint sites and customizations source-control first with all of the power of a top-tier IDE. Produce cleaner code, deliver faster.
* Publish files on save
* Use VSCode compare tools to diff local changes against the server
* Pull down remote folders to your local workspace
* No more editors messing with your markup 
* Support for: Windows, OSX, and Unix
* Keep all project configuration in Source Control for easy team integration

## Learn More
You can view additional documentation [on our wiki.](https://github.com/readysitego/spgo/wiki)

## Feedback
We love feedback! Please take a minute to complete our 2-question [Survey](https://forms.office.com/Pages/ResponsePage.aspx?id=DZb1uny9ZkKNWQyYu-wakJzz1QojmH9AnvOnKspXAdtUNFBVUVdYRTFQN00zOEFPQkFMT0EyMEpZUC4u) and help make 


Features
===
* All of the great code authoring and management features of Visual Studio Code, plus the ability to...
* Check out files from SharePoint
    * Check out current file using command `>SPGo: Check Out the current file`
    * Check out current file with the hotkey combo: `Alt+Shift+C`
* Publish files to SharePoint
    * Save|publish|check-in automatically on Save
    * Force publish using command `>SPGo: Publish the current file`
    * Publish a major version with the hotkey combo: `Alt+Shift+p`
    * Publish a minor version with the hotkey combo: `Alt+p`
    * Discard checkout using command `SPGo: Discard check out`
    * Specify an optional publishing message
* Retrieve the contents of a specified folder from SharePoint
    * Download individual folders using the command `>SPGo: Retrieve folder`
    * Optionally provide glob patterns to download only specific files
* Retrieve the contents of multiple folders from SharePoint (Synchronize)
    * Specify a glob pattern array of site-relative folders in the `remoteFolders` configuration node (See **Additional Configuration Options** below)
    * Download all subfolders automatically by using command `>SPGo: Populate workspace`
* Glob Support
    * All bulk download and upload functionality supports Glob formatting
    * note: individual file wildcard support for bulk downloads is still in progress. `>SPGo: Publish local workspace` supports all Glob patterns
* Manage multiple configurations
    * Configuration data is stored within the project directory and can be stored in source control
* Global Access
    * Support for Germany, China, and the US Government's private Office 365 deployments


Configuration and Getting Started
===
To get started using SPGo, press `Ctrl+Shift+p` (Windows) `Cmd+Shift+p` (Mac) or open the Command Pallet and type `>SPGo: Configure Workspace` to bring up the SPGo Configuration Wizard. Upon successful configuration, a new file will be created in the root of your project folder called `spgo.json`. From there, all files and folders created under the `src` folder in your local workspace will be deployed to their corresponding site-relative path your SharePoint site upon save.

### SPGo.json Configuration Files
If configuration was successful, you should see a file similar to below:

```json
{
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
} 
```
### Additional Configuration Options ###
#### Glob support for Publishing Workspace ####
Entering a [Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern into a node called `publishWorkspaceGlobPattern` will cause SPGo to publish only files which match this glob pattern. For example, if you use another VSCode plugin to minify files on save, you can configure the `>SPGo: Publish local workspace` command to publish all minified files in the workspace with the format `<file>.min.<ext>` by setting the  `publishWorkspaceGlobPattern` property to `/**/*.min.*`.

#### Populating Remote Files ####
When you specify an array of remote folders in a node called `remoteFolders`, SPGo will recursively download the remote folder contents to your local workspace when you issue the Synchronize Files command `>SPGo: Populate Workspace`. 
Note: This WILL overwrite all local files.

#### Example Config json ####
```json
{
    "checkInMessage" : "Your custom Check-in message here",
    "sourceDirectory": "src",
    "sharePointSiteUrl": "https://tenant.sharepoint.com/sites/MyProject",
    "publishingScope": "SaveOnly",
    "publishWorkspaceGlobPattern": "/**/*.min.*",
    "remoteFolders": [
        "/SiteAssets/**/*.*",
        "/_catalogs/wp/",
        "/_catalogs/masterpage/"
    ]
} 
```

Use
===
SPGo will automatically launch when you run the Configure Workspace command `>SPGo: Configure workspace` or any time the SPGO Configuration file `spgo.json` is detected in the root of the current workspace.

Security and Authentication Support
===
Credentials are stored in VSCode memory only. SPGo will only ask you for credentials the first time you sync with SharePoint each session. SPGo currently supports the following authentication modes:
* Digest (Office365)
* NTLM v1 (most on-premise installations)
* NTLM v1 + wwwAuth
* ADFS

    _A note for ADFS Authentication:_ You will need to add the following JSON node to the root of your your SPGo.json file:
    ```json
    "authenticationDetails": {
        "relayingParty": "[relaying party]",
        "adfsUrl": "[ADFS Url]"
    }
    ```

How to get in touch
===
Write an email, create an issue on git, @ us on twitter or request support via Stack Overflow. Any way you choose, we embrace feedback and want to hear from you. Here's how to get a hold of us:

* Tweet us: [@readysitego](https://twitter.com/ReadySiteGo)
* Request a feature: [Github/ReadySiteGo](https://github.com/readysitego/spgo/issues)
* Ask for help on [Stack Overflow](https://stackoverflow.com/): #SPGo
* Send us an email: [SPGo@sitego.co](mailto:spgo@sitego.co)


Issues
===
Please submit any issues or feature requests to [https://github.com/ReadySiteGo/SPGo/issues](https://github.com/ReadySiteGo/SPGo/issues) or, better yet, author a pull request.


Open Source
===
This project is offered under the MIT open source license. Collaboration, contribution, and feedback is welcomed and encouraged!


Thank You
===
I want to thank the following developers for inspiration and source packages:
* [John Nelson](https://github.com/celador): ForceCode author - example of a great VSCode IDE extension
* [Sergey Sergeev](https://github.com/s-KaiNet) : sp-request, spsave author
* [Andrew Koltyakov](https://github.com/koltyakov) : sppull author
* [@pkreipke](https://github.com/pkreipke) + [@lafayetteduarte](https://github.com/lafayetteduarte) : Authentication support


More about SiteGo
===
SiteGo is a content sharing solution for Office 365 that enables you to simply and securely collaborate with partners, vendors and users outside your company. You can learn more here: [https://www.sitego.co](https://www.sitego.co).