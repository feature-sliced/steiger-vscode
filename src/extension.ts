import { existsSync } from 'node:fs';
import path from 'node:path';

import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

declare const PRODUCTION: boolean;

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel('steiger');
  if (!PRODUCTION) {
    output.show(true);
  }
  output.appendLine('steiger extension activated');
  context.subscriptions.push(output);

  const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!root) {
    output.appendLine('no workspace folder found');
    return;
  }

  const serverModule = path.join(root, 'node_modules', 'steiger', 'dist', 'language-server.mjs');
  if (!existsSync(serverModule)) {
    output.appendLine(`server module not found: ${serverModule}`);
    return;
  }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.stdio },
    debug: {
      module: serverModule,
      transport: TransportKind.stdio,
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'javascriptreact' },
      { scheme: 'file', language: 'typescriptreact' },
      { scheme: 'file', language: 'vue' },
      { scheme: 'file', language: 'svelte' },
      { scheme: 'file', language: 'astro' },
    ],
  };

  client = new LanguageClient(
    'steiger',
    'steiger language server',
    serverOptions,
    clientOptions
  );

  output.appendLine(`starting steiger language server using "${serverModule}"`);
  client.start().catch(err => {
    output.appendLine(`Failed to start steiger language server: ${err}`);
  });
}

export function deactivate() {
  if (!client) {
    return;
  }

  return client.stop();
}
