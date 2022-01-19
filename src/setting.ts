import * as vscode from "vscode";

const fs = require('fs');
const path = require("path");

import { showError, mkDirRecursive } from "./utils";

const enum FTCEnabled {
  off = 0,
  on = 1,
}

export interface IKey {
  regex: RegExp | null;
  fsPath: string;
  secret: string;
}

export interface ISetting {
  enabled: boolean;
  secretPath: string;
  secretName: string;
  keyFilePath: string;
  keys: IKey[];
  label: string;
  delay: number;
  exclude: string[];
}

export class Setting {
  
  private setting: ISetting;
  public inited: boolean;
  
  constructor() {
    this.inited = false;
    this.setting = {
      enabled: false,
      secretPath: '.ftc',
      secretName: 'keys.json',
      keyFilePath: '',
      keys: [],
      label: '_*_',
      delay: 0,
      exclude: [
        "**/.ftc/**",
        "**/.vscode/**",
        "**/.gitignore/**",
        "**/node_modules/**",
      ]
    };
  }

  public init(curURI: vscode.Uri): ISetting {
    let config = vscode.workspace.getConfiguration("ftc"),
      enabled = <FTCEnabled>config.get("enabled"),
      secretPath = <string>config.get("secretPath") || ".ftc",
      secretName = <string>config.get("secretName") || "keys.json",
      message = "";
    const curSecretPath = path.join(curURI.fsPath, secretPath);
    const keysJSONFilePath = path.join(curSecretPath, secretName);

    if (!curURI) {
      message += "no folder opened, ";
    }
    if (typeof enabled === "boolean") {
      message += "ftc.enabled must be a number, ";
    }
    message && showError(message);

    this.inited = true;
    return this.setting = {
      enabled: !!enabled,
      secretPath: curSecretPath,
      secretName,
      keyFilePath: keysJSONFilePath,
      keys: this.readKeyFile(keysJSONFilePath),
      label: <string>config.get("label") || "_*_",
      delay: <number>config.get("delay") || 0,
      exclude: <string[]>config.get("exclude") || [
        "**/.ftc/**",
        "**/.vscode/**",
        "**/.gitignore/**",
        "**/node_modules/**",
      ],
    };  
  }

  public get(): ISetting {
    return this.setting;
  }

  public async saveNewKey(key: IKey) {
    const oldKeys = this.setting.keys;
    try {
      this.setting.keys.push(key);
      await this.saveKey();
    } catch (err: any) {
      this.setting.keys = oldKeys;
      console.error(`Failed in save new key, please check: ${err.toString()}`);
    }
  }

  private saveKey(keys = this.setting.keys, filePath = this.setting.keyFilePath) {
    try {
      mkDirRecursive(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(keys, null, 2), 'utf8');
    } catch (err: any) {
      console.error(`Failed in write keys file, please check: ${err.toString()}`);
    }
  }

  private readKeyFile(filePath: string): IKey[] {
    let keys: IKey[] = [], content = null;
    try {
      content = fs.readFileSync(filePath, "utf8");
      keys = JSON.parse(content);
    } catch (_) {
      try {
        this.saveKey([], filePath);
        keys = [];
      } catch (err: any) {
        console.error(`Failed in write default keys file, please check: ${err.toString()}`);
      }
    }
    return keys;
  }

  // TODO 监听删除配置文件
}
