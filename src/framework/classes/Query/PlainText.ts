import Fetch from "src/framework/classes/Query/Fetch";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { Query } from "src/framework/interfaces/Query";

export default class PlainText implements Query<string> {
  readonly fetch: Fetch;

  constructor(ref: string) {
    this.fetch = new Fetch(ref);
  }

  async execute(cancelToken: CancelToken): Promise<string> {
    const response = await this.fetch.execute(cancelToken);

    return response.text();
  }

  isEqual(other: PlainText): boolean {
    return this.fetch.isEqual(other.fetch);
  }
}
