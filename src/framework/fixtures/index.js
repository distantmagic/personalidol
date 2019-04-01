// @flow

import * as fs from "fs-extra";
import path from "path";
import YAML from "yaml";

export async function dialogue(filename: string) {
  const pathname = path.join(
    __dirname,
    "../fixtures/data/dialogues/",
    filename
  );
  const content = await fs.readFile(pathname, "utf8");

  return YAML.parse(content);
}
