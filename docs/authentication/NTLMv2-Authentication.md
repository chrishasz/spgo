NTLM v2 authentication is commonly used in corporate and on-premise SharePoint instances. Your username will be formatted as a domain login (e.g. `domain\username`) when prompted for login credentials.

## Additional Configuration
To specify NTLM authentication (v1 or v2), set the `authenticationType` property to `NTLM` in your `spgo.json` file, or by selecting the "NTLM" option when configuring your local environment with the `SPGO> Configure Workspace` command.
