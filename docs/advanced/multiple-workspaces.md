---
layout: page
title: Multiple Workspaces
---

SPGo supports [Multi-root Workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces), so that you can work with multiple different Site Collections in a single VSCode workspace.

When laying out your workspace, each SharePoint Site Collection should be its own root folder. Example:

```ascii
    |
    --siteCollection1
    |  |
    |  |--src
    |  |  |
    |  |  |--SiteAssets
    |  |  |  |
    |  |  |  |--main.js
    |  |  |  |
    |  |  |  |--main.css
    |  |--spgo.json
    |
    --siteCollection2
    |  |
    |  |--src
    |  |  |
    |  |  |--SiteAssets
    |  |  |  |
    |  |  |  |--main.js
    |  |  |  |
    |  |  |  |--additional.js
    |  |  |  |
    |  |  |  |--main.css
    |  |--spgo.json
```

## Commands

### Workspace-Scoped Commands

There are certain commands that can function across workspaces. In the event that there is no active workspace selected (based on the current file), then SPGo will present a menu to choose one of the folders in the workspace.

* [Configure workspace](/spgo/commands/configure-workspace)
* [Populate workspace](/spgo/commands/populate-workspace)
* [Publish workspace](/spgo/commands/publish-workspace)
* [Manually reload SPGo configuration](/spgo/commands/reload-configuration)
* [Retrieve folder](/spgo/commands/retrieve-folder)

### File-Scoped Commands

The rest of the commands require that a file is either open/active in the code editor, or selected in the Tree-view control.

* [Check out a file](/spgo/commands/check-out-file)
* [Compare file with server](/spgo/commands/compare-with-server)
* [Delete file from server](/spgo/commands/delete-file)
* [Discard checkout](/spgo/commands/discard-checkout)
* [Publish a Major Version of a file](/spgo/commands/publish-major-file)
* [Publish a Minor Version of a file](/spgo/commands/publish-minor-file)

When determining which file to apply a file-scoped command, VSCode uses the following priority:

1. The selected file in the Tree-view, if the command was activated from the Tree-view control.
2. The active file in the VSCode workspace, falling back to the selected file in the Tree-view control.
