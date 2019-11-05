// @flow

import * as THREE from "three";

import type { Material, TextureLoader } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { RuntimeCache } from "../interfaces/RuntimeCache";
import type { THREELoadingManager } from "../interfaces/THREELoadingManager";
import type { THREETilesetMaterials as THREETilesetMaterialsInterface } from "../interfaces/THREETilesetMaterials";
import type { TiledSkinnedTile } from "../interfaces/TiledSkinnedTile";
import type { TiledTile } from "../interfaces/TiledTile";

export default class THREETilesetMaterials implements THREETilesetMaterialsInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +materialsCache: RuntimeCache<Material>;
  +threeLoadingManager: THREELoadingManager;
  +threeTextureLoader: TextureLoader;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    materialsCache: RuntimeCache<Material>,
    threeLoadingManager: THREELoadingManager
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.materialsCache = materialsCache;
    this.threeLoadingManager = threeLoadingManager;
    this.threeTextureLoader = new THREE.TextureLoader(threeLoadingManager.getLoadingManager());
  }

  getTiledSkinnedTileMaterial(tiledSkinnedTile: TiledSkinnedTile): Material {
    return this.getTiledTileMaterial(tiledSkinnedTile.getTiledTile());
  }

  getTHREELoadingManager(): THREELoadingManager {
    return this.threeLoadingManager;
  }

  getTHREETextureLoader(): TextureLoader {
    return this.threeTextureLoader;
  }

  getTiledTileMaterial(tiledTile: TiledTile): Material {
    const tileImageSource = tiledTile.getTiledTileImage().getSource();

    return this.materialsCache.remember(tileImageSource, () => {
      return new THREE.MeshBasicMaterial({
        // color: [0xcccccc, 0xdddddd, 0xaaaaaa, 0x999999][1],
        // color: 0xffc000,
        map: this.getTHREETextureLoader().load(tileImageSource),
      });
    });
  }
}
