# LSP Test

The language server will run on _every_ file type by default.
To target specific languages, change `package.json`'s `activationEvents` to something like

```json
"activationEvents": [
  "onLanguage:plaintext"
],
```

## Overview

```
├── .vscode
│   ├── launch.json         // Tells VS Code how to launch our extension
│   └── tasks.json          // Tells VS Code how to build our extension
├── LICENSE
├── README.md
├── client
│   ├── package-lock.json   // Client dependencies lock file
│   ├── package.json        // Client manifest
│   ├── src
│   │   └── extension.ts    // Code to tell VS Code how to run our language server
│   └── tsconfig.json       // TypeScript config for the client
├── package-lock.json       // Top-level Dependencies lock file
├── package.json            // Top-level manifest
├── server
│   ├── package-lock.json   // Server dependencies lock file
│   ├── package.json        // Server manifest
│   ├── src
│   │   └── server.ts       // Language server code
│   └── tsconfig.json       // TypeScript config for the client
└── tsconfig.json           // Top-level TypeScript config
```

## Developing

Neovim:

```lua
-- ~/.config/nvim/ftplugin/<filetype>.lua
vim.lsp.start({
  name = "LSP Test",
  cmd = {
    "npx",
    "ts-node",
    vim.fn.expand("~/path/to/lsp-test/server/src/server.ts"),
  },
  capabilities = vim.lsp.protocol.make_client_capabilities(),
})
```

VS Code:

- Build: `npm run compile` or `ctrl(cmd)+shift+b`
- Launch: `[Extension Development Host]` via `Run and Debug` or `F5`

Useful links: [debug], [sample], [publish], [vsix]

[debug]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#debugging-both-client-and-server
[sample]: https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample
[publish]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
[vsix]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions
