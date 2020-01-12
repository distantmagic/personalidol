import { default as THREEMD2Character } from "src/framework/classes/MD2Character";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { MD2Character as THREEMD2CharacterInterface } from "src/framework/interfaces/MD2Character";
import { MD2CharacterConfig } from "src/framework/types/MD2CharacterConfig";
import { Query } from "src/framework/interfaces/Query";

export default class MD2Character implements Query<THREEMD2CharacterInterface> {
  readonly config: MD2CharacterConfig;
  readonly loadingManager: THREE.LoadingManager;

  constructor(loadingManager: THREE.LoadingManager, config: MD2CharacterConfig) {
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
