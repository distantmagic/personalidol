import { default as THREEMD2Character } from "../MD2Character";

import { LoadingManager } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { MD2Character as THREEMD2CharacterInterface } from "../../interfaces/MD2Character";
import { MD2CharacterConfig } from "../../types/MD2CharacterConfig";
import { Query } from "../../interfaces/Query";

export default class MD2Character implements Query<THREEMD2CharacterInterface> {
  readonly config: MD2CharacterConfig;
  readonly loadingManager: LoadingManager;

  constructor(loadingManager: LoadingManager, config: MD2CharacterConfig) {
    this.config = config;
    this.loadingManager = loadingManager;
  }

  execute(cancelToken: CancelToken): Promise<THREEMD2CharacterInterface> {
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
