// @flow

import Fetch from "./Fetch";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class RemoteJSON implements Query<string> {
  +fetch: Fetch;

  constructor(ref: string) {
    this.fetch = new Fetch(ref);
  }

  async execute(cancelToken: CancelToken): Promise<string> {
    const response = await this.fetch.execute(cancelToken);

    return response.json();
  }

  isEqual(other: RemoteJSON): boolean {
    return this.fetch.isEqual(other.fetch);
  }
}
