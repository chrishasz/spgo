# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.2.5 - 2018-5-17
### Added
- Unix support! Resoved [This Request](https://github.com/readysitego/spgo/issues/42) for Ubuntu support. OK, it sorta sounds like a bug, but really this is the first time I've tried building SharePoint solutions in a Unix environment.
### Changed
- Better warnings/errors for bad passwords and checked-out files.

## 1.2.4 - 2018-5-10
### Added
- [This request from Github](https://github.com/readysitego/spgo/issues/35) will now allow you to specify a default check-in message using the `checkInMessage` config property in `SPGo.json`
- [This other request from Github](https://github.com/readysitego/spgo/issues/34) will now allow you to manually reload config data from `SPGo.json` using the command `SPGO> Reload Configuration` or the shortcut `<alt> + r, <alt> + c`
### Fixed
- An issue where [Git integration caused unnecessary error messages in the SPGo output file](https://github.com/readysitego/spgo/issues/34)
- You will now be prompted to enter a check-in message when you set "Publish a Major|Minor" Version" as your default save action.
- Refactored our core promise chain to properly, and most-importantly: DRY-ly, handle errors. Errors should consistently log and the progress bar will once again cease its endless spinning.

## 1.2.3 - 2018-4-14
### Added
- Glob support for retrieving files (e.g. /SiteAssets/*.*, /SiteAssets/*.css)

## 1.2.2 - 2018-2-28
### Fixed
- Resolved the final dependency issue, [#27](https://github.com/readysitego/spgo/issues/27) & [#30](https://github.com/readysitego/spgo/issues/30), preventing SPGo from loading. Root cause was an issue with NPM resolving dependencies.

## 1.2.1 - 2018-2-26
### Added
- SPGo now supports Germany, China, and the US Government's private Office 365 deployments! Not so private now, huh?!?
### Fixed
- Resolved a visual issue where a glob pattern matching 0 items would cause the progress spinner to spin endlessly.
- Resolved a number of dependency errors and version incompatibilities between SPGo, TypeScript, VSCode and various Typings.

## 1.2.0 - 2018-2-23
### Added
- Glob file management for uploads using the `SPGo: Publish local workspace` command.
    - Inspiration: [this issue](https://github.com/readysitego/spgo/issues/24) from GitHub.
- Unit Tests! They're all the rage these days.
### Changed
- By Popular demand, all folders specified in the `remoteFolders` configuration property now respect glob formatting. If you want to download a folder and all subfolders, make sure to append `**/*.*` to all existing folder entries.
- Note: Glob support is ongoing development. File masking for remote file download is still in development.
### Fixed
- Security issue with dependency: `marked`

## 1.1.0 - 2018-1-18
### Added
- Custom commit messages for publishing files and workspace.
### Changed
- Cleaned up Changelog + Readme visual layouts.
### Fixed
- [This issue from Github](https://github.com/readysitego/spgo/issues/21) which prevented authentication when users specified NTLM.


## 1.0.1 - 2018-1-3
### Fixed
- [This issue from Github](https://github.com/readysitego/spgo/issues/19) which prevented file synchronization on save when users selected "SaveOnly" as the publishing scope.


## 1.0 - 2017-12-31
### Added
- Integrated VSCode's file comparison tools. File compare can now be used:
    - via the treeview context menu - right click on a file and compare to server.
    - when checking out a file - if the current server version and your local copy of a file are different, you will be prompted to view both files in a compare window.
- Refactored File Check in/out: Now you can manage binary files as well as text files through SPGo.
### Changed
- Reduced memory pressure with File checkout.
- Refactored Http error handling to provide a consistent user experience and DRY up a bunch of code. I'm only 80% happy with the current system, so expect more updates here in the future.
### Fixed
- Random testing showed that a publishing type of `None` failed in keeping its promise to not upload your file.


## 0.10.3 - 2017-12-21
### Added
- You will now receive an error messages when attempting to edit or check out a file that another user has already checked out.
### Fixed
- Resolved [This issue from Github](https://github.com/readysitego/spgo/issues/14) - Better handling for folder casing and managing files in root site collections.
- Resolved [This other issue from Github](https://github.com/readysitego/spgo/issues/16) wherein we handle non-existent folders more gracefully when populating a local workspace.


## 0.10.2 - 2017-12-06
### Added
- Current file status (Checked in | Checked out) now displayed in the VS Code footer.
- Added support for Forms authentication.
- Added support for ADFS authentication.
### Changed
- Enhanced support for NTLM authentication.
- Refactored the command objects and much of the File Service/Gateway code to be more Typescripty.
### Fixed
- Changelog dates were a month off. And you thought you WERE writing SharePoint code in the future!
- Better bad credential management. Was bad, now better.
- Resolved [This issue from Github](https://github.com/readysitego/spgo/issues/9) - When an error (or manual cancellation by the user) occurs during workspace configuration, SPGo will no properly handle an empty config file.
- Resolved [This other issue from Github](https://github.com/readysitego/spgo/issues/10) - Authentication issues when using Multi Auth Site (NTLM + Forms).
- Resolved [This other, other issue from Github](https://github.com/readysitego/spgo/issues/9) - When an error or cancellation causes an empty SPGo.json file to be created, SPGo will now properly recreate the json config on a subsequent use of the `>SPGo: Configure Workspace` command.


## 0.10.1 - 2017-09-11
### Added
- File Management (Publish, Check out, Undo check out) added as context menu items to
- Logged Messages, Warnings, and Errors are now color coded for better readability.
### Changed
- Lots of code cleanup.
### Fixed
- [Our first Open Issue on Github!](https://github.com/readysitego/spgo/issues/7) - Consequently our first resolved issue on Github. SPGo will now properly retrieve files from the root Site Collection of a SharePoint Web Application.
- Entering incorrect credentials will no longer cause the progress spinner to spin endlessly, robbing it of its one joy in life.


## 0.10.0 - 2017-08-29
### Added
- [Command] Publish local workspace - publishes all local files to SharePoint.
- [Command] SPGo: Discard check out - Discard the current file check-out and revert server file to the previous version.
- Added some shine to this thing! - Progress spinner rendered to window frame during server activity.
### Changed
- renamed "Synchronize files" to Populate local workspace
### Fixed
- Readme.md typos (I need type checking assistance for capital letters!)


## 0.9.1 - 2017-08-16
### Added
- Publish Minor version of a file via menu or hotkey
### Changed
- Synchronize files now reports success on completion.
### Fixed
- Synchronize Folders works now, regardless of which publish type a user has specified.
- CHANGELOG.md schema alignment


## 0.9.0 - 2017-08-15
### Added
- Language support for Master Pages (.master)
- New Publishing Setting: "Save & continue Editing" - Save the file to the server, but do not publish. 
- [Command] Check out the current file from the server.
- Better output logging: activity start and finish.
### Fixed
- Readme.md typos


## 0.8.1 - 2017-08-14
### Added
- [Command] Configure local workspace
- [Command] Reset SharePoint session credentials
- [Command] Publish file to SharePoint
- [Command] Retrieve the contents of a specified folder from SharePoint
- [Command] Retrieve the contents of multiple folders from SharePoint (Synchronize)
- Automatically save|publish|check-in current file on save action
- Initial project documentation (Changelog.md, Readme.md, LICENCE.txt)