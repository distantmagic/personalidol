import Fetch from "src/framework/classes/Query/Fetch";

import Query from "src/framework/classes/Query";

import { CancelToken } from "src/framework/interfaces/CancelToken";

export default class RemoteJSON<T extends Object> extends Query<T> {
  readonly fetch: Fetch;

  constructor(ref: string) {
    super();

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
