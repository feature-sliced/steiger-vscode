# Contributing

Use [pnpm](https://pnpm.io), not npm or yarn. The repo is pinned with `pnpm-lock.yaml` and configured via `pnpm-workspace.yaml`.

## Scripts

| Script | Description |
|---|---|
| `pnpm build` | Production bundle (minified) of the extension and language server into `dist/`. |
| `pnpm dev` | Build, then open VS Code with the extension loaded (Extension Development Host). |
| `pnpm package` | Pack a `.vsix`. The production build runs automatically via the `vscode:prepublish` hook; dependencies are bundled by esbuild, hence `--no-dependencies`. |

## @feature-sliced/language-server

The extension's core: the version in `dependencies` is what esbuild bundles and ships to users. Keep it in sync with the extension code and test any change to how it is resolved, imported, or bundled carefully. It is exempt from `minimumReleaseAge` in `pnpm-workspace.yaml`, so updating to freshly released versions is intentional.

### Local development with pnpm link

```sh
# in the language-server checkout
pnpm install && pnpm build

# in steiger-vscode
pnpm link path/to/language/server/checkout

# when done, restores the registry version
pnpm unlink
```

The server is bundled by esbuild, so restart `pnpm dev` after each change to the linked package.
