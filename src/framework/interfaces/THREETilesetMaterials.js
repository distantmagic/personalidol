// @flow

import type { Material, TextureLoader } from "three";

import type { THREELoadingManager } from "./THREELoadingManager";
import type { TiledSkinnedTile } from "./TiledSkinnedTile";
import type { TiledTile } from "./TiledTile";

export interface THREETilesetMaterials {
  getTHREELoadingManager(): THREELoadingManager;

  getTHREETextureLoader(): TextureLoader;

  getTiledSkinnedTileMaterial(TiledSkinnedTile): Material;

  getTiledTileMaterial(TiledTile): Material;
}
