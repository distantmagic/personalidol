import Fetch from "src/framework/classes/Query/Fetch";
import Query from "src/framework/classes/Query";

import CancelToken from "src/framework/interfaces/CancelToken";

export default class PlainText extends Query<string> {
  readonly fetch: Fetch;

  constructor(ref: string) {
    super();

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
