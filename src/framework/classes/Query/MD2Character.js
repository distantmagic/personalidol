// @flow

import { default as THREEMD2Character } from "../MD2Character";

import type { LoadingManager } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { MD2Character as THREEMD2CharacterInterface } from "../../interfaces/MD2Character";
import type { Query } from "../../interfaces/Query";

export default class MD2Character implements Query<THREEMD2CharacterInterface> {
  +config: Object;
  +loadingManager: LoadingManager;

  constructor(loadingManager: LoadingManager, config: Object) {
    this.config = config;
    this.loadingManager = loadingManager;
  }

  async execute(cancelToken: CancelToken): Promise<THREEMD2CharacterInterface> {
    const character = new THREEMD2Character(this.loadingManager);

    return new Promise(resolve => {
      character.onLoadComplete = () => {
        resolve(character);
      };
      character.loadParts(this.config);
    });
  }

  isEqual(other: MD2Character): boolean {
    return this.config.baseUrl === other.config.baseUrl;
  }
}
