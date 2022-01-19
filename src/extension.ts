import * as vscode from 'vscode';

import { FTCController }  from './controller';
import { COMMAND_PROMPT } from './constants.js';

/**
	* Activate the extension.
	*/
export function activate(context: vscode.ExtensionContext) {
	const controller = new FTCController();

	context.subscriptions.push(
		vscode.commands.registerCommand(
			COMMAND_PROMPT.key,
			controller.cryptoText.bind(controller)
		)
	);

	// const treeProvider = new TreeProvider(controller);

	vscode.workspace.onDidChangeConfiguration(evt => {
		if ( evt.affectsConfiguration('ftc') ) {
			// TODO refresh
		}
	});
}

/**
	* Sure not.
	*/
// export function deactivate() {}
