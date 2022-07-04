import * as vscode from 'vscode';

import fs = require('fs');
import path = require('path');

import { ISetting, Setting, IKey } from './setting';
import { getCurWSFolderURI, showError, show, log, getRandKey, assertion } from './utils';

const cryptoJS = require("crypto-js");

export class FTCController {

  private setting: Setting;

  constructor() {
      this.setting = new Setting();
  }

  public async cryptoText() {
    const editor = assertion.activeEditor();
    const fsPath = editor.document.uri.fsPath;
    let prompt = '';
    if (!this.setting.inited) {
      await this.initSetting();
    }
    let key = await this.getKeyFor(fsPath);
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

    const validateInput = function (key: string) {
      if (!key) {
        return 'ESC to cancel input';
      }
      return '';
    };
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
        const writeContent = `${label}${secretText}${label}`;
        editor.edit((textEdit) => {
          textEdit.insert(editor.selection.active, writeContent);
        });
      }
    });
  }

  public async deCryptoText() {
    const editor = assertion.activeEditor();
    let selection = editor.document.getText(editor.selection);
		if(!selection) {
      return false;
		}
    
    const fsPath = editor.document.uri.fsPath;
    const key = await this.getKeyFor(fsPath);
    if (key) {
      const label = this.setting.get().label;
      // @example _*_base64_*_ -> base64
      const text = selection.replaceAll(label, '');
      const secretText = cryptoJS.AES.decrypt(text, key!.secret).toString(cryptoJS.enc.Utf8);
      vscode.window.showInformationMessage(secretText);
    } else {
      showError('No key found for this file.');
    }
  }

  private async getKeyFor(fsPath: string): Promise<IKey | undefined> {
    if (!this.setting.inited) {
      await this.initSetting();
    }
    return this.setting.get().keys.find(x => {
      const isFSPathEqual = () => x.fsPath && (x.fsPath === fsPath);
      const isRegexTested = () => x.regex && x.regex.test(fsPath);
      return isFSPathEqual() || isRegexTested();
    });
  }

  private async initSetting() {
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

