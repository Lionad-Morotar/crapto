import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

import { ISetting, Setting } from './setting';
import { getCurWSFolderURI, showError, show } from './utils';

const glob = require('glob');
const anymatch = require('anymatch');
const cryptoJS = require("crypto-js");

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
    const setting = this.setting.init(wsFolderURI);
    this.mkDirRecursive(setting.secretPath);
    const target = path.join(setting.secretPath, setting.secretName);
    fs.writeFileSync(target, 'test');
  }

  public cryptoText() {
    const validateInput = function (key: string) {
      if (!key) {
        return 'ESC to cancel input';
      }
      return '';
    };
    const editor = vscode.window.activeTextEditor;
    if (!(editor && editor.document && editor.edit)) {
      return show('No active dcoument');
    }
    const options = {
      prompt: '',
      placeHolder: 'Text you want to encrypt',
      value: '',
      ignoreFocusOut: true,
      validateInput
    };
    vscode.window.showInputBox(options).then(val => {
      if (!val) {
        return show('No text provided');
      }
      const invalid = validateInput(val);
      if (!invalid) {
        const label = this.setting.get().label;
        const secretText = cryptoJS.AES.encrypt(val, 'anypassword').toString();
        // cryptoJS.AES.decrypt(secretText, 'anypassword').toString(cryptoJS.enc.Utf8);
        const writeContent = `${label}${secretText}${label}`;
        editor.edit((textEdit) => {
          textEdit.insert(editor.selection.active, writeContent);
        });
      }
    });
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

