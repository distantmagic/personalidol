// @flow

import * as THREE from "three";

import type { BufferGeometry, Mesh } from "three";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledSkinnedTile } from "../interfaces/TiledSkinnedTile";
import type { TiledTile } from "../interfaces/TiledTile";
import type { THREETilesetMaterials } from "../interfaces/THREETilesetMaterials";
import type { THREETilesetMeshes as THREETilesetMeshesInterface } from "../interfaces/THREETilesetMeshes";

export default class THREETilesetMeshes implements THREETilesetMeshesInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileGeometry: BufferGeometry;
  +threeTilesetMaterials: THREETilesetMaterials;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeTilesetMaterials: THREETilesetMaterials,
    tileGeometry: BufferGeometry
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.threeTilesetMaterials = threeTilesetMaterials;
    this.tileGeometry = tileGeometry;
  }

  getTHREETilesetMaterials(): THREETilesetMaterials {
    return this.threeTilesetMaterials;
  }

  getTiledSkinnedTileMesh(tiledSkinnedTile: TiledSkinnedTile): Mesh {
    const tilePosition = tiledSkinnedTile.getElementPosition();
    const tileMesh = this.getTiledTileMesh(tiledSkinnedTile.getTiledTile());

    tileMesh.position.x = tilePosition.getX();
    tileMesh.position.z = tilePosition.getY();
    tileMesh.rotation.x = (-1 * Math.PI) / 2;
    tileMesh.rotation.y = 0;
    tileMesh.rotation.z = Math.PI / 2;

    return tileMesh;
  }

  getTiledTileMesh(tiledTile: TiledTile): Mesh {
    return new THREE.Mesh(this.tileGeometry, this.threeTilesetMaterials.getTiledTileMaterial(tiledTile));
  }
}
