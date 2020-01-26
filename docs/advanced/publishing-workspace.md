---
layout: page
title: Handling Processed Files
---

_note: this documentation is currently in the process of being updated._

## Scenario 1: Publishing Bundled Files

These files are often found in a separate folder outside of the /src directory in your workspace (e.g. /dist).

## Scenario 2: Publishing Specific Files

By default, the [publishWorkspace command](/spgo/commands/publish-workspace) will publish all files in the `src` directory. There are times where you may want to only publish a specific subset of files, or you may want to publish to a different folder than you have mapped in your local `src` directory.

### Publish all Minified Files

Using [glob notation](https://en.wikipedia.org/wiki/Glob_(programming)){:target="_blank"} to only publish files which have been minified. _note: this assumes your minified files are named `<filename>.min.<ext>`._

```json
    "publishWorkspaceOptions": {
        "globPattern" : "/**/*.min.*"
    }
```

### Publish all Files to a Specific Folder

```json
    "publishWorkspaceOptions": {
        "destinationFolder" : "/SiteAssets/project",
    }
```
