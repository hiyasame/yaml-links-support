// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LinkProvider } from './links';
import { getSupportFileTypes } from './config';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  	const linkProvider = new LinkProvider();

	let supportFileTypes = getSupportFileTypes();

	let linkProviderDisposable = vscode.languages.registerDocumentLinkProvider(supportFileTypes, linkProvider);
	context.subscriptions.push(linkProviderDisposable);

	// watch configuration change

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration("yaml-links-support.file-types")) {
				supportFileTypes = getSupportFileTypes();
				linkProviderDisposable.dispose();
				context.subscriptions.splice(
					context.subscriptions.findIndex(obj => obj === linkProviderDisposable),
					1
				);
				linkProviderDisposable = vscode.languages.registerDocumentLinkProvider(supportFileTypes, linkProvider);
				context.subscriptions.push(linkProviderDisposable);
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
