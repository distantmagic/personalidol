// @flow

import * as fs from "fs-extra";
import path from "path";
import YAML from "yaml";

export async function dialogue(filename: string) {
  const content = await file(filename);

  return YAML.parse(content);
}

export async function file(filename: string): Promise<string> {
  return await fs.readFile(findPath(filename), "utf8");
}

export function findPath(filename: string): string {
  return path.join(__dirname, "../fixtures/", filename);
}
