import Query from "src/framework/classes/Query";
import { default as THREEMD2Character } from "src/framework/classes/MD2Character";

import CancelToken from "src/framework/interfaces/CancelToken";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IMD2Character } from "src/framework/interfaces/MD2Character";

import MD2CharacterConfig from "src/framework/types/MD2CharacterConfig";

export default class MD2Character extends Query<IMD2Character> {
  readonly config: MD2CharacterConfig;
  readonly loadingManager: THREE.LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, loadingManager: THREE.LoadingManager, config: MD2CharacterConfig) {
    super();

    this.config = config;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  execute(cancelToken: CancelToken): Promise<IMD2Character> {
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
