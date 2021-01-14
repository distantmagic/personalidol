import { AnimationClip } from "three/src/animation/AnimationClip";
import { AnimationMixer } from "three/src/animation/AnimationMixer";
import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { requestTexture } from "@personalidol/texture-loader/src/requestTexture";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import type { AnimationMixer as IAnimationMixer } from "three/src/animation/AnimationMixer";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EntityMD2Model } from "@personalidol/quakemaps/src/EntityMD2Model.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function MD2ModelView(scene: Scene, entity: EntityMD2Model, md2MessagePort: MessagePort, texturesMessagePort: MessagePort, rpcLookupTable: RPCLookupTable): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _disposables: Set<DisposableCallback> = new Set();
  const _mountables: Set<MountableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();

  let _animationMixer: null | IAnimationMixer = null;

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(_mountables);
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    const { load: geometry } = await sendRPCMessage(rpcLookupTable, md2MessagePort, {
      load: {
        model_name: entity.model_name,
        rpc: MathUtils.generateUUID(),
      },
    });

    const textureUrl = `${__ASSETS_BASE_PATH}/models/model-md2-${entity.model_name}/skins/${geometry.parts.skins[entity.skin]}`;
    const bufferGeometry = new BufferGeometry();

    bufferGeometry.setAttribute("normal", new BufferAttribute(geometry.normals, 3));
    bufferGeometry.setAttribute("position", new BufferAttribute(geometry.vertices, 3));
    bufferGeometry.setAttribute("uv", new BufferAttribute(geometry.uvs, 2));

    // animation

    const morphPositions = [];
    const morphNormals = [];

    for (let i = 0, l = geometry.frames.length; i < l; i++) {
      const frame = geometry.frames[i];
      const attributeName = frame.name;

      if (frame.vertices.length > 0) {
        const positions = [];

        for (let j = 0, jl = geometry.qVertexIndices.length; j < jl; j++) {
          const vertexIndex = geometry.qVertexIndices[j];
          const stride = vertexIndex * 3;

          const x = frame.vertices[stride];
          const y = frame.vertices[stride + 1];
          const z = frame.vertices[stride + 2];

          positions.push(x, y, z);
        }

        const positionAttribute = new Float32BufferAttribute(positions, 3);
        positionAttribute.name = attributeName;

        morphPositions.push(positionAttribute);
      }

      if (frame.normals.length > 0) {
        const frameNormals: Array<number> = [];

        for (let j = 0, jl = geometry.qVertexIndices.length; j < jl; j++) {
          const vertexIndex = geometry.qVertexIndices[j];
          const stride = vertexIndex * 3;

          const nx = frame.normals[stride];
          const ny = frame.normals[stride + 1];
          const nz = frame.normals[stride + 2];

          frameNormals.push(nx, ny, nz);
        }

        var normalAttribute = new Float32BufferAttribute(frameNormals, 3);
        normalAttribute.name = attributeName;

        morphNormals.push(normalAttribute);
      }
    }

    bufferGeometry.morphAttributes.position = morphPositions;
    bufferGeometry.morphAttributes.normal = morphNormals;
    bufferGeometry.morphTargetsRelative = false;

    const animations = AnimationClip.CreateClipsFromMorphTargetSequences(geometry.frames, 10, false);

    const material = new MeshBasicMaterial({
      color: 0xcccccc,
      flatShading: true,
      map: await _loadTexture(textureUrl),
      morphTargets: true,
      // morphNormals: true,
    });
    const mesh = new Mesh(bufferGeometry, material);

    _animationMixer = new AnimationMixer(mesh);

    const animationAction = _animationMixer.clipAction(animations[0], mesh);

    animationAction.play();

    console.log(_animationMixer);
    console.log(animations);
    console.log(animationAction);

    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

    _mountables.add(function () {
      scene.add(mesh);
    });

    _disposables.add(disposableGeneric(bufferGeometry));
    _disposables.add(disposableMaterial(material));

    _unmountables.add(function () {
      scene.remove(mesh);
    });

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    fUnmount(_unmountables);
  }

  function update(delta: number, elapsedTime: number) {
    if (_animationMixer === null) {
      return;
    }

    console.log('update');
    _animationMixer.update(delta);
  }

  async function _loadTexture(textureUrl: string): Promise<ITexture> {
    const texture = await requestTexture<ITexture>(rpcLookupTable, texturesMessagePort, textureUrl);

    _disposables.add(disposableGeneric(texture));

    return texture;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: false,
    isView: true,
    name: `MD2ModelView("${entity.model_name}",${entity.skin})`,
    needsUpdates: true,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
