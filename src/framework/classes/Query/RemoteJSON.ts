import Fetch from "./Fetch";

import { CancelToken } from "../../interfaces/CancelToken";
import { Query } from "../../interfaces/Query";

export default class RemoteJSON<T extends Object> implements Query<T> {
  readonly fetch: Fetch;

  constructor(ref: string) {
    this.fetch = new Fetch(ref);
  }

  async execute(cancelToken: CancelToken): Promise<T> {
    const response = await this.fetch.execute(cancelToken);

    return response.json();
  }

  isEqual(other: RemoteJSON<T>): boolean {
    return this.fetch.isEqual(other.fetch);
  }
}
