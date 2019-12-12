// @flow

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Fetch implements Query<Response> {
  +ref: string;

  constructor(ref: string) {
    this.ref = ref;
  }

  execute(cancelToken: CancelToken): Promise<Response> {
    return fetch(this.ref, {
      signal: cancelToken.getAbortSignal(),
    });
  }

  isEqual(other: Fetch): boolean {
    return this.ref === other.ref;
  }
}
