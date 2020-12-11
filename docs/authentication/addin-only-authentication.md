---
layout: page
title: Addin-only Authentication
---

Addin-only authentication works by registering SPGo as an authenticated Addin that is allowed to make changes to your SharePoint site. This is a common workaround for accessing a SharePont site which has been secured with 2FA. that does not yet support Multi-Factor authentication.

When prompted for credentials, you will need to provide the `clientId`, `clientSecret`, and (optionally) the `realm` value for your Tenant. All of these values are defined when you go through the process of registering SPGo as an Addin on your SharePoint Site.

## Additional Configuration

To specify Addin-only authentication, set the `authenticationType` property to `AddinOnly` in your `spgo.json` file, or by selecting the "Addin-only" option when configuring your local environment with the `SPGO> Configure Workspace` command.

## Registering SPGo as an Addin on your SharePoint Site

To manage your SharePoint site using SPGo with Addin-only authentication, you will need to register SPGo as an addin for a specific Site and then apply permissions for the Addin. You can apply permissions for the Addin at the Site scope, or the Tenant scope to tightly control access.

### Registering SPGo as an Addin

To register SPGo for your Site, navigate here: `<path-to-site>/_layouts/15/appregnew.aspx` (e.g. `https://tenant.sharepoint.com/sites/site/_layouts/15/appregnew.aspx`)

### Applying Permissions

* To apply permissions at a global level, navigate to: `https://[organizaiton]-admin.sharepoint.com/_layouts/15/appinv.aspx`
* To apply permissions at a Site level, navigation to: `<path-to-site>/_layouts/15/appinv.aspx`

_note: the permission request xml is different for Global vs. Site registration

#### Global Permission XML

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
  <AppPermissionRequest Scope="http://sharepoint/content/tenant" Right="FullControl" />
</AppPermissionRequests>
```

#### SiteCollection Permission XML

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
  <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl" />
</AppPermissionRequests>
```

#### Web Permission XML

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
  <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl" />
</AppPermissionRequests>
```

### Detailed instructions

You can [see a detailed configuration walkthough here](https://github.com/s-KaiNet/node-sp-auth/wiki/SharePoint%20Online%20addin%20only%20authentication) on the [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth) library documentation.
