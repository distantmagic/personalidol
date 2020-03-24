import * as THREE from "three";

import Fetch from "src/framework/classes/Query/Fetch";
import Query from "src/framework/classes/Query";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";

export default class RemoteJSON<T extends Object> extends Query<T> {
  readonly fetch: Fetch;
  private static uuid = THREE.MathUtils.generateUUID();

  constructor(ref: string) {
    super();

    this.fetch = new Fetch(ref);
  }

  @cancelable(true)
  async execute(cancelToken: CancelToken): Promise<T> {
    const response = await this.fetch.execute(cancelToken);

    return response.json();
  }

  getQueryUUID(): string {
    return RemoteJSON.uuid;
  }

  isEqual(other: RemoteJSON<T>): boolean {
    return this.fetch.isEqual(other.fetch);
  }
}
