import { AnimationClip } from "three/src/animation/AnimationClip";
import { AnimationMixer } from "three/src/animation/AnimationMixer";
import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute";
import { Group } from "three/src/objects/Group";
import { MathUtils } from "three/src/math/MathUtils";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { createEmptyMesh } from "@personalidol/framework/src/createEmptyMesh";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { mountAll } from "@personalidol/framework/src/mountAll";
import { requestTexture } from "@personalidol/texture-loader/src/requestTexture";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import { useObject3DUserSettings } from "./useObject3DUserSettings";
import { useObjectLabel } from "./useObjectLabel";

import type { AnimationClip as IAnimationClip } from "three/src/animation/AnimationClip";
import type { AnimationMixer as IAnimationMixer } from "three/src/animation/AnimationMixer";
import type { Group as IGroup } from "three/src/objects/Group";
import type { Mesh as IMesh } from "three/src/objects/Mesh";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { MD2LoaderMorphPosition } from "@personalidol/three-modules/src/loaders/MD2LoaderMorphPosition.type";
import type { MD2LoaderParsedGeometryWithParts } from "@personalidol/three-modules/src/loaders/MD2LoaderParsedGeometryWithParts.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";
import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { UserSettings } from "./UserSettings.type";

type AnimationClipsCached = {
  animations: Array<IAnimationClip>;
  usage: number;
};

const _animationClipsCache: Map<string, AnimationClipsCached> = new Map();
let _globalAnimationOffset: number = 0;

function _clearCachedAnimations(entity: EntityMD2Model): void {
  const cachedAnimations: undefined | AnimationClipsCached = _animationClipsCache.get(entity.model_name);

  if (!cachedAnimations) {
    throw new Error(`Expected MD2 animation set to be cached: "${entity.model_name}"`);
  }

  cachedAnimations.usage -= 1;

  if (cachedAnimations.usage < 1) {
    _animationClipsCache.delete(entity.model_name);
  }
}

function _getSetCachedAnimations(entity: EntityMD2Model, geometry: any): Array<IAnimationClip> {
  const cachedAnimations: undefined | AnimationClipsCached = _animationClipsCache.get(entity.model_name);

  if (cachedAnimations) {
    cachedAnimations.usage += 1;

    return cachedAnimations.animations;
  }

  const animations = AnimationClip.CreateClipsFromMorphTargetSequences(geometry.frames, 10, false);

  _animationClipsCache.set(entity.model_name, {
    animations: animations,
    usage: 1,
  });

  return animations;
}

// function _morphNormalToBufferAttribute(morphNormal: MD2LoaderMorphNormal) {
//   const bufferAttribute = new Float32BufferAttribute(morphNormal.normals, 3, true);

//   bufferAttribute.name = morphNormal.name;

//   return bufferAttribute;
// }

function _morphPositionToBufferAttribute(morphPosition: MD2LoaderMorphPosition) {
  const bufferAttribute = new Float32BufferAttribute(morphPosition.positions, 3, true);

  bufferAttribute.name = morphPosition.name;

  return bufferAttribute;
}

export function MD2ModelView(
  userSettings: UserSettings,
  scene: Scene,
  entity: EntityMD2Model,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  rpcLookupTable: RPCLookupTable
): View {
  const id: string = MathUtils.generateUUID();
  const name: string = `MD2ModelView("${entity.model_name}",${entity.skin})`;
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  _globalAnimationOffset += 0.3;

  const _animationOffset: number = _globalAnimationOffset;
  const _disposables: Set<DisposableCallback> = new Set();
  const _labelContainer: IGroup = new Group();
  const _mesh: IMesh = createEmptyMesh();
  const _mountables: Set<MountableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();

  let _animationMixer: null | IAnimationMixer = null;

  function _applyUserSettings() {
    useObject3DUserSettings(userSettings, _mesh);
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
      load: MD2LoaderParsedGeometryWithParts;
    } = await sendRPCMessage(rpcLookupTable, md2MessagePort, {
      load: {
        model_name: entity.model_name,
        rpc: MathUtils.generateUUID(),
      },
    });

    // Geometry

    const bufferGeometry = new BufferGeometry();

    bufferGeometry.setAttribute("normal", new BufferAttribute(geometry.normals, 3));
    bufferGeometry.setAttribute("position", new BufferAttribute(geometry.vertices, 3));
    bufferGeometry.setAttribute("uv", new BufferAttribute(geometry.uvs, 2));

    // MorphNormals does not exist in basic material since it's not reflective.
    // bufferGeometry.morphAttributes.normal = geometry.morphNormals.map(_morphNormalToBufferAttribute);

    bufferGeometry.morphAttributes.position = geometry.morphPositions.map(_morphPositionToBufferAttribute);
    bufferGeometry.morphTargetsRelative = false;

    // Material

    const material = new MeshBasicMaterial({
      color: 0xcccccc,
      flatShading: true,
      map: await _loadTexture(`${__ASSETS_BASE_PATH}/models/model-md2-${entity.model_name}/skins/${geometry.parts.skins[entity.skin]}?${__CACHE_BUST}`),
      morphTargets: true,
      // morphNormals: true,
    });

    // Mesh

    _mesh.geometry = bufferGeometry;
    _mesh.material = material;

    // Update morph targets after swapping both geometry and material.
    _mesh.updateMorphTargets();

    _mesh.rotation.set(0, entity.angle, 0);
    _mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

    // Object label

    _mesh.add(_labelContainer);

    // Only use standing animation to offset the bounding box.
    _labelContainer.position.set(0, geometry.boundingBoxes.stand.max.y + 5, 0);

    useObjectLabel(domMessagePort, _labelContainer, entity, _mountables, _unmountables, _disposables);

    // User settings

    _applyUserSettings();

    // Animations

    _animationMixer = new AnimationMixer(_mesh);

    const animations = _getSetCachedAnimations(entity, geometry);

    _disposables.add(function () {
      _clearCachedAnimations(entity);
    });

    const animationAction = _animationMixer.clipAction(animations[0]);

    _mountables.add(function () {
      // Update animationoffset so identical models standing next to each other
      // won't have synchronized movements.
      animationAction.time = _animationOffset;
      animationAction.play();

      scene.add(_mesh);
    });

    _disposables.add(disposableGeneric(bufferGeometry));
    _disposables.add(disposableMaterial(material));

    _unmountables.add(function () {
      animationAction.stop();

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

  function update(delta: number) {
    if (_animationMixer === null) {
      throw new Error("AnimationMixer should be prepared during 'preload' phase.");
    }

    _applyUserSettings();

    if (!state.isPaused) {
      _animationMixer.update(delta);
    }
  }

  async function _loadTexture(textureUrl: string): Promise<ITexture> {
    const texture = await requestTexture<ITexture>(rpcLookupTable, texturesMessagePort, textureUrl);

    _disposables.add(disposableGeneric(texture));

    return texture;
  }

  return Object.freeze({
    id: id,
    isScene: false,
    isView: true,
    name: name,
    needsUpdates: true,
    object3D: _mesh,
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
