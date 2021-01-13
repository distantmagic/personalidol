import { BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { noop } from "@personalidol/framework/src/noop";
import { requestTexture } from "@personalidol/texture-loader/src/requestTexture";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

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

    const material = new MeshBasicMaterial({
      color: 0xcccccc,
      flatShading: true,
      map: await _loadTexture(textureUrl),
    });
    const mesh = new Mesh(bufferGeometry, material);

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
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
