// @flow

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class URLTextContent implements Query<string> {
  +ref: string;

  constructor(ref: string) {
    this.ref = ref;
  }

  async execute(cancelToken: CancelToken): Promise<?string> {
    const response = await fetch(this.ref, {
      signal: cancelToken.getAbortSignal(),
    });

    return await response.text();
  }

  isEqual(other: URLTextContent): boolean {
    return this.ref === other.ref;
  }
}
