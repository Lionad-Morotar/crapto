import fs from "fs";
import path from "path";

import { COMMAND_TEST } from "../out/constants.js";

const commands = [COMMAND_TEST];

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

packageJSON.contributes.commands = commands.map((x) => ({
  title: x.desc,
  command: x.key,
}));

fs.writeFileSync(
  path.resolve("package.json"),
  JSON.stringify(packageJSON, null, 2),
  "utf8"
);
