import * as vscode from 'vscode';

import { FTCController }  from './FTC.controller';
import { COMMAND_TEST, LogLevel } from './constants.js';

/**
	* Activate the extension.
	*/
export function activate(context: vscode.ExtensionContext) {
	const controller = new FTCController();

	context.subscriptions.push(
		vscode.commands.registerCommand(
			COMMAND_TEST.key,
			controller.createSecret
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
