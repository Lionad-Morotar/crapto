import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

import glob = require('glob');
import anymatch = require('anymatch');

import { ISetting, Setting } from './FTC.setting';
import { getCurWSFolderURI, showError } from './utils';

export class FTCController {

  private setting;

  constructor() {
      this.setting = new Setting();
  }

  public createSecret(editor: vscode.TextEditor) {
    const wsFolderURI = getCurWSFolderURI();
    if (!wsFolderURI) {
      return vscode.window.showInformationMessage('No opened document');
    }
    const setting = this.setting.get(wsFolderURI);
    this.mkDirRecursive(setting.secretPath);
    const target = path.join(setting.secretPath, setting.secretName);
    fs.writeFileSync(target, 'test');
  }

  private mkDirRecursive(fsPath: string): boolean {
    try {
      console.log('fsPath:', fsPath);
      fs.mkdirSync(fsPath, {recursive: true});
      return true;
    }
    catch (err: any) {
      showError(`Error to create secret file: '${err.toString()}'`);
      return false;
    }
  }
}

