import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { MathUtils } from "three/src/math/MathUtils";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

import { AmbientLightView } from "@personalidol/personalidol-views/src/AmbientLightView";
import { buildViews } from "@personalidol/personalidol-views/src/buildViews";
import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { createTextureReceiverMessagesRouter } from "@personalidol/texture-loader/src/createTextureReceiverMessagesRouter";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { getPrimaryPointerStretchVectorX } from "@personalidol/framework/src/getPrimaryPointerStretchVectorX";
import { getPrimaryPointerStretchVectorY } from "@personalidol/framework/src/getPrimaryPointerStretchVectorY";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { HemisphereLightView } from "@personalidol/personalidol-views/src/HemisphereLightView";
import { imageDataBufferResponseToTexture } from "@personalidol/texture-loader/src/imageDataBufferResponseToTexture";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { MD2ModelView } from "@personalidol/personalidol-views/src/MD2ModelView";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { PlayerView } from "@personalidol/personalidol-views/src/PlayerView";
import { PointLightView } from "@personalidol/personalidol-views/src/PointLightView";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { resetProgressManagerState } from "@personalidol/loading-manager/src/resetProgressManagerState";
import { resolveScriptedBlockController } from "@personalidol/personalidol-views/src/resolveScriptedBlockController";
import { ScriptedBlockView } from "@personalidol/personalidol-views/src/ScriptedBlockView";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";
import { SpotlightLightView } from "@personalidol/personalidol-views/src/SpotlightLightView";
import { TargetView } from "@personalidol/personalidol-views/src/TargetView";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { updateStoreCameraAspect } from "@personalidol/three-renderer/src/updateStoreCameraAspect";
import { WorldspawnGeometryView } from "@personalidol/personalidol-views/src/WorldspawnGeometryView";

import { uiStateOnly } from "./uiStateOnly";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EntityFuncGroup } from "@personalidol/personalidol-mapentities/src/EntityFuncGroup.type";
import type { EntityGLTFModel } from "@personalidol/personalidol-mapentities/src/EntityGLTFModel.type";
import type { EntityLightAmbient } from "@personalidol/personalidol-mapentities/src/EntityLightAmbient.type";
import type { EntityLightHemisphere } from "@personalidol/personalidol-mapentities/src/EntityLightHemisphere.type";
import type { EntityLightPoint } from "@personalidol/personalidol-mapentities/src/EntityLightPoint.type";
import type { EntityLightSpotlight } from "@personalidol/personalidol-mapentities/src/EntityLightSpotlight.type";
import type { EntityLookupTable } from "@personalidol/personalidol-views/src/EntityLookupTable.type";
import type { EntityMD2Model } from "@personalidol/personalidol-mapentities/src/EntityMD2Model.type";
import type { EntityPlayer } from "@personalidol/personalidol-mapentities/src/EntityPlayer.type";
import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { EntitySounds } from "@personalidol/personalidol-mapentities/src/EntitySounds.type";
import type { EntitySparkParticles } from "@personalidol/personalidol-mapentities/src/EntitySparkParticles.type";
import type { EntityTarget } from "@personalidol/personalidol-mapentities/src/EntityTarget.type";
import type { EntityWorldspawn } from "@personalidol/personalidol-mapentities/src/EntityWorldspawn.type";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";
import type { View } from "@personalidol/framework/src/View.interface";

const CAMERA_ZOOM_MAX = 200;
const CAMERA_ZOOM_MIN = 1400;

const _camera = new PerspectiveCamera();

_camera.far = 3000;
_camera.near = 1;

const _cameraDirection = new Vector3();
const _disposables: Set<DisposableCallback> = new Set();
const _playerPosition = new Vector3();
const _pointerVector = new Vector2(0, 0);
const _pointerVectorRotationPivot = new Vector2(0, 0);
const _scene = new Scene();

_scene.background = new Color(0x000000);
_scene.fog = new Fog(_scene.background, _camera.far - 1000, _camera.far);

const _mountables: Set<MountableCallback> = new Set();
const _unmountables: Set<UnmountableCallback> = new Set();

const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _md2MessageRouter = createRouter({
  geometry: handleRPCResponse(_rpcLookupTable),
});
const _quakeMapsRouter = createRouter({
  map: handleRPCResponse(_rpcLookupTable),
});
const _textureReceiverMessageRouter = createTextureReceiverMessagesRouter(_rpcLookupTable);
let _cameraZoomAmount = 0;

export function MapScene(
  logger: Logger,
  effectComposer: EffectComposer,
  eventBus: EventBus,
  views: Set<View>,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  mapFilename: string
): IScene {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  _camera.position.set(100, 100, 100);
  _camera.lookAt(0, 0, 0);
  _camera.getWorldDirection(_cameraDirection);

  const entityLookupTable: EntityLookupTable = {
    func_group(entity: EntityFuncGroup): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    light_ambient(entity: EntityLightAmbient): View {
      return AmbientLightView(_scene, entity);
    },

    light_hemisphere(entity: EntityLightHemisphere): View {
      return HemisphereLightView(_scene, entity);
    },

    light_point(entity: EntityLightPoint): View {
      return PointLightView(_scene, entity);
    },

    light_spotlight(entity: EntityLightSpotlight): View {
      return SpotlightLightView(_scene, entity);
    },

    model_gltf(entity: EntityGLTFModel): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
      // const model = await loaders.gltf.loadAsync(`/models/model-glb-${entity.model_name}/model.glb`);
      // const mesh = model.scene.children[0] as Mesh;

      // mesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);

      // _mountables.add(function () {
      //   _scene.add(mesh);
      // });

      // _disposables.add(disposableGeneric(mesh.geometry));
      // _disposables.add(disposableMaterial(mesh.material));

      // _unmountables.add(function () {
      //   _scene.remove(mesh);
      // });
    },

    model_md2(entity: EntityMD2Model): View {
      return MD2ModelView(_scene, entity, md2MessagePort, texturesMessagePort, _rpcLookupTable);
    },

    player(entity: EntityPlayer): View {
      _playerPosition.set(entity.origin.x, entity.origin.y, entity.origin.z);
      _onCameraUpdate();

      return PlayerView(_scene, entity);
    },

    scripted_block(entity: EntityScriptedBlock, worldspawnTexture: ITexture): View {
      return ScriptedBlockView(logger, _scene, entity, worldspawnTexture, views, resolveScriptedBlockController);
    },

    sounds(entity: EntitySounds): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    spark_particles(entity: EntitySparkParticles): View {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    target(entity: EntityTarget): View {
      return TargetView(_scene, entity);
    },

    worldspawn(entity: EntityWorldspawn, worldspawnTexture: ITexture): View {
      return WorldspawnGeometryView(logger, _scene, entity, worldspawnTexture);
    },
  };

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fMount(_mountables);

    eventBus.POINTER_ZOOM_REQUEST.add(_onPointerZoomRequest);

    domMessagePort.postMessage(uiStateOnly({}));

    const renderPass = new RenderPass(_scene, _camera);

    effectComposer.addPass(renderPass);
    _unmountables.add(unmountPass(effectComposer, renderPass));
    _disposables.add(disposableGeneric(renderPass));

    _cameraZoomAmount = 400;
    _onCameraUpdate();
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    md2MessagePort.onmessage = _md2MessageRouter;
    quakeMapsMessagePort.onmessage = _quakeMapsRouter;
    texturesMessagePort.onmessage = _textureReceiverMessageRouter;

    resetProgressManagerState(progressMessagePort);

    const {
      unmarshal: { entities, textureAtlas },
    } = await sendRPCMessage(_rpcLookupTable, quakeMapsMessagePort, {
      unmarshal: {
        discardOccluding: {
          x: _cameraDirection.x,
          y: _cameraDirection.y,
          z: _cameraDirection.z,
        },
        filename: mapFilename,
        rpc: MathUtils.generateUUID(),
      },
    });

    const worldspawnTexture = imageDataBufferResponseToTexture(textureAtlas);

    _disposables.add(disposableGeneric(worldspawnTexture));

    for (let view of buildViews(logger, entityLookupTable, worldspawnTexture, entities)) {
      views.add(view);
    }

    state.isPreloading = false;
    state.isPreloaded = true;

    _unmountables.add(function () {
      md2MessagePort.onmessage = _md2MessageRouter;
      quakeMapsMessagePort.onmessage = _quakeMapsRouter;
      texturesMessagePort.onmessage = _textureReceiverMessageRouter;
    });
  }

  function unmount(): void {
    state.isMounted = false;

    eventBus.POINTER_ZOOM_REQUEST.delete(_onPointerZoomRequest);

    fUnmount(_unmountables);
  }

  function update(delta: number, elapsedTime: number): void {
    updateStoreCameraAspect(_camera, dimensionsState);

    if (isPrimaryPointerPressed(inputState)) {
      _pointerVector.x = getPrimaryPointerStretchVectorX(inputState);
      _pointerVector.y = getPrimaryPointerStretchVectorY(inputState);
      _pointerVector.rotateAround(_pointerVectorRotationPivot, (3 * Math.PI) / 4);
      _playerPosition.x += 1000 * _pointerVector.y * delta;
      _playerPosition.z += 1000 * _pointerVector.x * delta;
      _onCameraUpdate();
    }

    effectComposer.render(delta);
  }

  function _onCameraUpdate(): void {
    // prettier-ignore
    _camera.position.set(
      _playerPosition.x + _cameraZoomAmount,
      _playerPosition.y + _cameraZoomAmount,
      _playerPosition.z + _cameraZoomAmount
    );

    _camera.lookAt(_playerPosition.x, _playerPosition.y, _playerPosition.z);
  }

  function _onPointerZoomRequest(zoomAmount: number): void {
    _cameraZoomAmount += zoomAmount < 0 ? -200 : 200;
    _cameraZoomAmount = Math.max(CAMERA_ZOOM_MAX, _cameraZoomAmount);
    _cameraZoomAmount = Math.min(CAMERA_ZOOM_MIN, _cameraZoomAmount);
    _onCameraUpdate();
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: true,
    isView: false,
    name: `Map(${mapFilename})`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
