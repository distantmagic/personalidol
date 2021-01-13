import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { FrontSide } from "three/src/constants";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";

import { attachAtlasSamplerToStandardShader } from "@personalidol/texture-loader/src/attachAtlasSamplerToStandardShader";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { noop } from "@personalidol/framework/src/noop";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { EntityWorldspawn } from "@personalidol/quakemaps/src/EntityWorldspawn.type";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function WorldspawnView(logger: Logger, scene: Scene, entity: EntityWorldspawn, worldspawnTexture: ITexture): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _disposables: Set<DisposableCallback> = new Set();
  const _mountables: Set<MountableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(_mountables);
  }

  function preload(): void {
    state.isPreloading = true;

    logger.debug(`LOADED_MAP_TRIS(${entity.vertices.length / 3})`);

    const bufferGeometry = new BufferGeometry();

    bufferGeometry.setAttribute("atlas_uv_start", new BufferAttribute(entity.atlasUVStart, 2));
    bufferGeometry.setAttribute("atlas_uv_stop", new BufferAttribute(entity.atlasUVStop, 2));
    bufferGeometry.setAttribute("normal", new BufferAttribute(entity.normals, 3));
    bufferGeometry.setAttribute("position", new BufferAttribute(entity.vertices, 3));
    bufferGeometry.setAttribute("uv", new BufferAttribute(entity.uvs, 2));
    bufferGeometry.setIndex(new BufferAttribute(entity.indices, 1));

    const meshStandardMaterial = new MeshStandardMaterial({
      flatShading: true,
      map: worldspawnTexture,
      side: FrontSide,
    });

    // Texture atlas is used here, so texture sampling fragment needs to
    // be changed.
    meshStandardMaterial.onBeforeCompile = attachAtlasSamplerToStandardShader;

    const mesh = new Mesh(bufferGeometry, meshStandardMaterial);

    mesh.castShadow = mesh.receiveShadow = false;
    mesh.matrixAutoUpdate = false;

    _mountables.add(function () {
      scene.add(mesh);
    });

    _unmountables.add(function () {
      scene.remove(mesh);
    });

    _disposables.add(disposableGeneric(bufferGeometry));
    _disposables.add(disposableMaterial(meshStandardMaterial));

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    fUnmount(_unmountables);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: false,
    isView: true,
    name: `WorldspawnView`,
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
