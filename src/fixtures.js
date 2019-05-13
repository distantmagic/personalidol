// @flow

import * as fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import { DOMParser } from "xmldom";

export async function file(filename: string): Promise<string> {
  return await fs.readFile(findPath(filename), "utf8");
}

export function findPath(filename: string): string {
  return path.resolve(__dirname, "../fixtures/", filename);
}

export async function xmlFile(filename: string): Promise<Document> {
  const domParser = new DOMParser();

  return this.domParser.parseFromString(
    await file(filename),
    "application/xml"
  );
}

export async function yamlFile(filename: string): Promise<Object> {
  const content = await file(filename);

  return YAML.parse(content);
}
