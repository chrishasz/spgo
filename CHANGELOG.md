# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Compare workspace file to server
- Auto-diff files on check-out conflict
- File minification on save/upload
- More control over which files/folders are synchronized

## 0.10.2 - 2017-12-21
### Added
- You will now receive an error messages when attempting to edit or check out a file that another user has already checked out.
###Fixed
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
###Fixed
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
- Project:
- Initial project documentation (Changelog.md, Readme.md, LICENCE.txt)

## [Unreleased]: 