// @flow

import * as fixtures from "../../../fixtures";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class FixturesFile implements Query<string> {
  +ref: string;

  constructor(ref: string) {
    this.ref = ref;
  }

  async execute(cancelToken: CancelToken): Promise<?string> {
    return await fixtures.file(this.ref);
  }

  isEqual(other: FixturesFile): boolean {
    return this.ref === other.ref;
  }
}
