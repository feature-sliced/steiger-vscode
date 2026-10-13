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
  const output = vscode.window.createOutputChannel('steiger', { log: true });
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

  const configuredServerPath = vscode.workspace
    .getConfiguration('steiger')
    .get<string>('languageServerPath', '');

  let serverModule = context.asAbsolutePath(path.join('dist', 'language-server.js'));
  if (configuredServerPath) {
    const customServerModule = path.isAbsolute(configuredServerPath)
      ? configuredServerPath
      : path.join(root, configuredServerPath);
    if (existsSync(customServerModule)) {
      serverModule = customServerModule;
    } else {
      output.appendLine(`steiger.languageServerPath does not exist: ${customServerModule}; using the bundled server`);
    }
  }
  output.appendLine(`starting steiger language server using "${serverModule}"`);

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
    outputChannel: output,
  };

  client = new LanguageClient(
    'steiger',
    'steiger language server',
    serverOptions,
    clientOptions
  );

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
