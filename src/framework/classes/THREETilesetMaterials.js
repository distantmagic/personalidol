// @flow

import * as THREE from "three";

import type { Material, TextureLoader } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { THREELoadingManager } from "../interfaces/THREELoadingManager";
import type { THREETilesetMaterials as THREETilesetMaterialsInterface } from "../interfaces/THREETilesetMaterials";
import type { TiledSkinnedTile } from "../interfaces/TiledSkinnedTile";
import type { TiledTile } from "../interfaces/TiledTile";

export default class THREETilesetMaterials implements THREETilesetMaterialsInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +materialsCache: Map<string, Material>;
  +threeLoadingManager: THREELoadingManager;
  +threeTextureLoader: TextureLoader;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, threeLoadingManager: THREELoadingManager) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.materialsCache = new Map<string, Material>();
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
    const textureLoader = this.getTHREETextureLoader();
    const tileImageSource = tiledTile.getTiledTileImage().getSource();

    const cachedMaterial = this.materialsCache.get(tileImageSource);

    if (cachedMaterial) {
      return cachedMaterial;
    }

    const material = new THREE.MeshPhongMaterial({
      // color: [0xcccccc, 0xdddddd, 0xaaaaaa, 0x999999][random(0, 3)]
      map: textureLoader.load(tileImageSource),
      // roughness: 1,
      // side: THREE.DoubleSide
    });

    this.materialsCache.set(tileImageSource, material);

    return material;
  }
}
