import Fetch from "src/framework/classes/Query/Fetch";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { Query } from "src/framework/interfaces/Query";

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
