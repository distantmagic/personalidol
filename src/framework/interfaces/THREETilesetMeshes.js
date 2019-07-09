// @flow

import type { Mesh } from "three";

import type { THREETilesetMaterials } from "./THREETilesetMaterials";
import type { TiledSkinnedTile } from "./TiledSkinnedTile";
import type { TiledTile } from "./TiledTile";

export interface THREETilesetMeshes {
  getTHREETilesetMaterials(): THREETilesetMaterials;

  getTiledSkinnedTileMesh(TiledSkinnedTile): Mesh;

  getTiledTileMesh(TiledTile): Mesh;
}
