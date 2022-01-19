import * as vscode from "vscode";

const path = require("path");

import { showError } from "./utils";

const enum FTCEnabled {
  off = 0,
  on = 1,
}

export interface ISetting {
  enabled: boolean;
  secretPath: string;
  secretName: string;
  label: string;
  delay: number;
  exclude: string[];
}

export class Setting {
  
  private setting: ISetting;
  
  constructor() {
    this.setting = {
      enabled: false,
      secretPath: '.ftc',
      secretName: 'any.txt',
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

  public get(): ISetting {
    return this.setting;
  }

  public init(curURI: vscode.Uri): ISetting {
    let config = vscode.workspace.getConfiguration("ftc"),
      enabled = <FTCEnabled>config.get("enabled"),
      secretPath = <string>config.get("secretPath") || ".ftc",
      message = "";

    if (!curURI) {
      message += "no folder opened, ";
    }
    if (typeof enabled === "boolean") {
      message += "ftc.enabled must be a number, ";
    }
    message && showError(message);

    return this.setting = {
      enabled: !!enabled,
      secretPath: path.join(curURI.fsPath, secretPath),
      secretName: <string>config.get("secretName") || "any.txt",
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
}
