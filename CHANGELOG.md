# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Checkout|checkin|publish actions to file context menu
- Auto-diff files on save conflict
- Report information about file on open (Checked out, current version, etc.)

## 0.10.0 - 2017-09-29
### Added
- [Command] Publish local workspace - publishes all local files to SharePoint.
- [Command] SPGo: Discard check out - Discard the current file check-out and revert server file to the previous version.
- Added some shine to this thing! - Progress spinner rendered to window frame during server activity.
### Changed
- renamed "Synchronize files" to Populate local workspace
### Fixed
- Readme.md typos (I need type checking assistance for capital letters!)

## 0.9.1 - 2017-09-16
### Added
- Publish Minor version of a file via menu or hotkey
### Changed
- Synchronize files now reports success on completion.
### Fixed
- Synchronize Folders works now, regardless of which publish type a user has specified.
- CHANGELOG.md schema alignment

## 0.9.0 - 2017-09-15
### Added
- Language support for Master Pages (.master)
- New Publishing Setting: "Save & continue Editing" - Save the file to the server, but do not publish. 
- [Command] Check out the current file from the server.
- Better output logging: activity start and finish.
### Fixed
- Readme.md typos

## 0.8.1 - 2017-09-14
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