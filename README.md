# steiger-vscode

This is a language server extension for [steiger](https://github.com/feature-sliced/steiger).

> [!WARNING]  
> The language server is bundled with the extension, but it loads the steiger core from your workspace. Install `steiger@0.8.0` or newer in the workspace.

> [!WARNING]
> The bundled language server requires Node.js 22.0.0 or newer, and Node.js 24.13.1 or newer is recommended because older versions have known issues with symlinks and pnpm. The server runs on the Node.js bundled with VS Code, so keeping VS Code up to date is usually enough.

## Settings

| Setting | Default | Description |
|---|---|---|
| `steiger.languageServerPath` | `""` | Path to a custom language server module used instead of the bundled one. Relative paths are resolved against the workspace root. Leave empty to use the bundled server. Changing it requires a window reload. |
| `steiger.trace.server` | `"off"` | Traces the communication between VS Code and the steiger language server. One of `off`, `messages`, or `verbose`. |


## Development
