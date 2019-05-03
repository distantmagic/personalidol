// @flow

import path from "path";

import type { TiledRelativeFilename as TiledRelativeFilenameInterface } from "../interfaces/TiledRelativeFilename";

export default class TiledRelativeFilename
  implements TiledRelativeFilenameInterface {
  +base: string;
  +relative: string;

  constructor(base: string, relative: string): void {
    this.base = base;
    this.relative = relative;
  }

  asString() {
    return path.resolve(path.dirname(this.base), this.relative);
  }

  isEqual(other: TiledRelativeFilenameInterface): boolean {
    return this.asString() === other.asString();
  }
}
