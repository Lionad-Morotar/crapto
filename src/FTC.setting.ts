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
  delay: number;
  exclude: string[];
}

export class Setting {
  constructor() {}

  public get(curURI: vscode.Uri): ISetting {
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

    return {
      enabled: !!enabled,
      secretPath: path.join(curURI.fsPath, secretPath),
      secretName: <string>config.get("secretName") || "any.txt",
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
