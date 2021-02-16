import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { FrontSide } from "three/src/constants";
import { MathUtils } from "three/src/math/MathUtils";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { Vector3 } from "three/src/math/Vector3";

import { attachAtlasSamplerToStandardShader } from "@personalidol/texture-loader/src/attachAtlasSamplerToStandardShader";
import { createEmptyMesh } from "@personalidol/framework/src/createEmptyMesh";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { mountAll } from "@personalidol/framework/src/mountAll";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import { UserSettingsManager } from "./UserSettingsManager";

import type { Box3 } from "three/src/math/Box3";
import type { Logger } from "loglevel";
import type { Mesh as IMesh } from "three/src/objects/Mesh";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { UserSettings } from "./UserSettings.type";
import type { WorldspawnGeometryView as IWorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

const _geometryOffset = new Vector3();

export function WorldspawnGeometryView(
  logger: Logger,
  userSettings: UserSettings,
  scene: Scene,
  entity: Geometry,
  worldspawnTexture: ITexture,
  matrixAutoUpdate: boolean = false
): IWorldspawnGeometryView {
  const id: string = MathUtils.generateUUID();
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _disposables: Set<DisposableCallback> = new Set();
  const _mesh: IMesh = createEmptyMesh();
  const _mountables: Set<MountableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();
  const _userSettingsManager = UserSettingsManager(userSettings, _mesh);

  function dispose(): void {
    state.isDisposed = true;

    disposeAll(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    mountAll(_mountables);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;

    logger.debug(`LOADED_MAP_TRIS("${id}", ${entity.vertices.length / 3})`);

    // Geometry

    const bufferGeometry = new BufferGeometry();

    bufferGeometry.setAttribute("atlas_uv_start", new BufferAttribute(entity.atlasUVStart, 2));
    bufferGeometry.setAttribute("atlas_uv_stop", new BufferAttribute(entity.atlasUVStop, 2));
    bufferGeometry.setAttribute("normal", new BufferAttribute(entity.normals, 3));
    bufferGeometry.setAttribute("position", new BufferAttribute(entity.vertices, 3));
    bufferGeometry.setAttribute("uv", new BufferAttribute(entity.uvs, 2));
    bufferGeometry.setIndex(new BufferAttribute(entity.indices, 1));

    _disposables.add(disposableGeneric(bufferGeometry));

    // Material

    const meshStandardMaterial = new MeshStandardMaterial({
      flatShading: true,
      map: worldspawnTexture,
      side: FrontSide,
    });

    // Texture atlas is used here, so texture sampling fragment needs to
    // be changed.
    meshStandardMaterial.onBeforeCompile = attachAtlasSamplerToStandardShader;

    _disposables.add(disposableMaterial(meshStandardMaterial));

    // Mesh

    _mesh.geometry = bufferGeometry;
    _mesh.material = meshStandardMaterial;

    // Offset geometry back to its origin, then move the mesh to the place
    // where geometry was expected to be in the map editor. This helps with
    // rotations and other operations like that.

    bufferGeometry.computeBoundingBox();

    const geometryBoundingBox: null | Box3 = bufferGeometry.boundingBox;

    if (!geometryBoundingBox) {
      throw new Error("Unable to compute geometry bounding box");
    }

    geometryBoundingBox.getCenter(_geometryOffset);

    bufferGeometry.translate(-1 * _geometryOffset.x, -1 * _geometryOffset.y, -1 * _geometryOffset.z);

    _mesh.position.set(_geometryOffset.x, _geometryOffset.y, _geometryOffset.z);
    _mesh.matrixAutoUpdate = matrixAutoUpdate;

    // Apply user settings before updating mesh matrix.
    _userSettingsManager.preload();

    if (!matrixAutoUpdate) {
      // This one update is necessary to set offsets correctly.
      _mesh.updateMatrix();
    }

    _mountables.add(function () {
      scene.add(_mesh);
    });

    _unmountables.add(function () {
      scene.remove(_mesh);
    });

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    id: id,
    isScene: false,
    isView: true,
    name: `WorldspawnGeometryView`,
    needsUpdates: true,
    object3D: _mesh,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: _userSettingsManager.update,
  });
}
