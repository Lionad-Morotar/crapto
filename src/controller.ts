import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

import { ISetting, Setting, IKey } from './setting';
import { getCurWSFolderURI, showError, show, log, getRandKey } from './utils';

const cryptoJS = require("crypto-js");

export class FTCController {

  private setting;

  constructor() {
      this.setting = new Setting();
  }

  public async cryptoText() {
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

    const fsPath = editor.document.uri.fsPath;
    let prompt = '';
    if (!this.setting.inited) {
      await this.initSetting();
    }
    let key = this.setting.get().keys.find(x => {
      const isFSPathEqual = () => x.fsPath && (x.fsPath === fsPath);
      const isRegexTested = () => x.regex && x.regex.test(fsPath);
      return isFSPathEqual() || isRegexTested();
    });
    if (key) {
      log('use finded key:', key);
    } else {
      log('not find key for file:', fsPath);
    }
    if (!key) {
      prompt = '[RAND_KEY]';
      key = {
        fsPath,
        regex: null,
        secret: getRandKey()
      };
      await this.saveNewKey(key);
    } else {
      prompt = `[FIND_KEY]: ${key.regex || key.fsPath}`;
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
        const secretText = cryptoJS.AES.encrypt(val, key!.secret).toString();
        // cryptoJS.AES.decrypt(secretText, key!.secret).toString(cryptoJS.enc.Utf8);
        const writeContent = `${label}${secretText}${label}`;
        editor.edit((textEdit) => {
          textEdit.insert(editor.selection.active, writeContent);
        });
      }
    });
  }

  private async initSetting () {
    const wsFolderURI = getCurWSFolderURI();
    if (!wsFolderURI) {
      return showError('No opened document');
    }
    await this.setting.init(wsFolderURI);
  }

  private async saveNewKey(key: IKey) {
    await this.setting.saveNewKey(key);
  }
}

