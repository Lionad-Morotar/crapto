import fs from "fs";
import path from "path";

import * as commands from "../out/constants.js";

let packageJSON = {},
  packageJSONContent = null;
try {
  packageJSONContent = fs.readFileSync(path.resolve("package.json"), "utf8");
} catch (err) {
  console.error("Failed in read package.json, please check.");
}
try {
  packageJSON = JSON.parse(packageJSONContent);
} catch (err) {
  console.error("Failed in parse package.json, please check.");
}

packageJSON.contributes.commands = Object.entries(commands)
  .filter(([k, v]) => k.startsWith("COMMAND"))
  .map(([k, v]) => ({
    title: v.desc,
    command: v.key,
  }));

fs.writeFileSync(
  path.resolve("package.json"),
  JSON.stringify(packageJSON, null, 2),
  "utf8"
);
