import * as THREE from "three";

import Fetch from "src/framework/classes/Query/Fetch";
import Query from "src/framework/classes/Query";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";

export default class PlainText extends Query<string> {
  readonly fetch: Fetch;
  private static uuid = THREE.MathUtils.generateUUID();

  constructor(ref: string) {
    super();

    this.fetch = new Fetch(ref);
  }

  @cancelable(true)
  async execute(cancelToken: CancelToken): Promise<string> {
    const response = await this.fetch.execute(cancelToken);

    return response.text();
  }

  getQueryUUID(): string {
    return PlainText.uuid;
  }

  isEqual(other: PlainText): boolean {
    return this.fetch.isEqual(other.fetch);
  }
}
