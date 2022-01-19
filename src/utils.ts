import * as vscode from "vscode";

const fs = require('fs');
const path = require('path');

export function log(...args: any[]) {
  console.log('[FTCINFO]', ...args);
}

export function showError(msg: string) {
  vscode.window.showWarningMessage(`Error: ${msg.slice(0, -2)}`, {}, { title: "Setting", isCloseAffordance: false, id: 0 });
}

export function show(msg: string) {
  vscode.window.setStatusBarMessage(msg);
}

export function getRandKey(len = 20) {
  if (len <= 0) {
    return '';
  }
  const base = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return base
    .repeat(Math.floor(Math.random() * 1000) + (len % base.length))
    .split('')
    .sort((_, __) => Math.random() - .5)
    .slice(0, len)
    .join('');
}

export function getCurWSFolderURI() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  
  if (!workspaceFolders || !workspaceFolders.length) {
    return showError('No workspace opened.');
  }

  // TODO multy root check
  return workspaceFolders[0].uri;
}

export function mkDirRecursive(fsPath: string): boolean {
  try {
    fs.mkdirSync(fsPath, {recursive: true});
    return true;
  }
  catch (err: any) {
    showError(`Error to create secret file: '${err.toString()}'`);
    return false;
  }
}
