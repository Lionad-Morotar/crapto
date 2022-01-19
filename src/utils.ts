import * as vscode from "vscode";

export function showError(msg: string) {
  vscode.window.showWarningMessage(`Error: ${msg.slice(0, -2)}`, {}, { title: "Setting", isCloseAffordance: false, id: 0 });
}

export function show(msg: string) {
  vscode.window.setStatusBarMessage(msg);
}

export function getCurWSFolderURI() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  
  if (!workspaceFolders || !workspaceFolders.length) {
    return showError('No workspace opened.');
  }

  // TODO multy root check
  return workspaceFolders[0].uri;
}