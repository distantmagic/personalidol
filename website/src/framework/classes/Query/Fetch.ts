import Query from "src/framework/classes/Query";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";

export default class Fetch extends Query<Response> {
  readonly ref: string;

  constructor(ref: string) {
    super();

    this.ref = ref;
  }

  @cancelable(true)
  execute(cancelToken: CancelToken): Promise<Response> {
    return fetch(this.ref, {
      signal: cancelToken.getAbortSignal(),
    });
  }

  isEqual(other: Fetch): boolean {
    return this.ref === other.ref;
  }
}
