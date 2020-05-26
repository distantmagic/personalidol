import * as fs from "fs-extra";
import path from "path";

export async function file(filename: string): Promise<string> {
  return fs.readFile(findPath(filename), "utf8");
}

export function findPath(filename: string): string {
  return path.resolve(__dirname, "../fixtures/", filename);
}
