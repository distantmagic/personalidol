import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { MathUtils } from "three/src/math/MathUtils";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Object3D } from "three/src/core/Object3D";

import { createEmptyMesh } from "@personalidol/framework/src/createEmptyMesh";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { mountAll } from "@personalidol/framework/src/mountAll";
import { requestTexture } from "@personalidol/texture-loader/src/requestTexture";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import { MeshUserSettingsManager } from "./MeshUserSettingsManager";

import type { Logger } from "loglevel";
import type { Mesh as IMesh } from "three/src/objects/Mesh";
import type { Object3D as IObject3D } from "three/src/core/Object3D";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { GeometryAttributes } from "@personalidol/three-modules/src/loaders/GeometryAttributes.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function GLTFModelView(
  logger: Logger,
  userSettings: UserSettings,
  scene: Scene,
  entity: EntityGLTFModel,
  gltfMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  rpcLookupTable: RPCLookupTable
): EntityView {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const _disposables: Set<DisposableCallback> = new Set();
  const _mesh: IMesh = createEmptyMesh();
  const _meshUserSettingsManager = MeshUserSettingsManager(logger, userSettings, _mesh);
  const _mountables: Set<MountableCallback> = new Set();
  const _object3D: IObject3D = new Object3D();
  const _unmountables: Set<UnmountableCallback> = new Set();

  async function _loadTexture(textureUrl: string): Promise<ITexture> {
    const texture = await requestTexture<ITexture>(rpcLookupTable, texturesMessagePort, textureUrl);

    _disposables.add(disposableGeneric(texture));

    return texture;
  }

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

  async function preload(): Promise<void> {
    state.isPreloading = true;

    const {
      load: geometry,
    }: {
      load: GeometryAttributes;
    } = await sendRPCMessage(rpcLookupTable, gltfMessagePort, {
      load: {
        model_name: entity.model_name,
        model_scale: entity.scale,
        rpc: MathUtils.generateUUID(),
      },
    });

    // Geometry

    const bufferGeometry = new BufferGeometry();

    bufferGeometry.setAttribute("normal", new BufferAttribute(geometry.normal, 3));
    bufferGeometry.setAttribute("position", new BufferAttribute(geometry.position, 3));
    bufferGeometry.setAttribute("uv", new BufferAttribute(geometry.uv, 2));

    if (geometry.index) {
      bufferGeometry.setIndex(new BufferAttribute(geometry.index, 1));
    }

    // Material

    const material = new MeshBasicMaterial({
      color: 0xcccccc,
      flatShading: true,
      map: await _loadTexture(`${__ASSETS_BASE_PATH}/models/model-glb-${entity.model_name}/${entity.model_texture}?${__CACHE_BUST}`),
      morphTargets: false,
    });

    // Mesh

    _mesh.geometry = bufferGeometry;
    _mesh.material = material;

    // Update morph targets after swapping both geometry and material.
    _mesh.updateMorphTargets();

    _mesh.rotation.set(0, entity.angle, 0);
    _mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

    // User settings

    _meshUserSettingsManager.preload();

    _mountables.add(function () {
      scene.add(_mesh);
    });

    _disposables.add(disposableGeneric(bufferGeometry));
    _disposables.add(disposableMaterial(material));

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

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    _meshUserSettingsManager.update(delta, elapsedTime, tickTimerState);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `GLTFModelView`,
    object3D: _object3D,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
