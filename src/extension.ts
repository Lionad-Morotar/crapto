import * as vscode from 'vscode';

import { FTCController }  from './FTC.controller';
// import TreeProvider  from './FTC.tree';

/**
	* Activate the extension.
	*/
export function activate(context: vscode.ExtensionContext) {
	const controller = new FTCController();

	context.subscriptions.push(vscode.commands.registerTextEditorCommand('ftc.test', controller.createSecret, controller));
	// context.subscriptions.push(vscode.commands.registerTextEditorCommand('ftc.gists-on', controller.gistsOn, controller));
	// context.subscriptions.push(vscode.commands.registerTextEditorCommand('ftc.gists-on', controller.gistsOff, controller));

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
