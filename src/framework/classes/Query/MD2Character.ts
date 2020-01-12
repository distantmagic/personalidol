import { default as THREEMD2Character } from "src/framework/classes/MD2Character";

import Query from "src/framework/classes/Query";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { MD2Character as THREEMD2CharacterInterface } from "src/framework/interfaces/MD2Character";
import { MD2CharacterConfig } from "src/framework/types/MD2CharacterConfig";

export default class MD2Character extends Query<THREEMD2CharacterInterface> {
  readonly config: MD2CharacterConfig;
  readonly loadingManager: THREE.LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, loadingManager: THREE.LoadingManager, config: MD2CharacterConfig) {
    super();

    this.config = config;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  execute(cancelToken: CancelToken): Promise<THREEMD2CharacterInterface> {
    const character = new THREEMD2Character(this.loggerBreadcrumbs.add("execute"), this.loadingManager);

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
