import { AmbientLight } from "three/src/lights/AmbientLight";
import { BoxGeometry } from "three/src/geometries/BoxGeometry";
import { Color } from "three/src/math/Color";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";
import { SpotLight } from "three/src/lights/SpotLight";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { GlitchPass } from "@personalidol/three-modules/src/postprocessing/GlitchPass";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { unmountAll } from "@personalidol/framework/src/unmountAll";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { updateStoreCameraAspect } from "@personalidol/three-renderer/src/updateStoreCameraAspect";

import { BackgroundLightUserSettingsManager } from "./BackgroundLightUserSettingsManager";
import { MeshUserSettingsManager } from "./MeshUserSettingsManager";
import { ShadowLightUserSettingsManager } from "./ShadowLightUserSettingsManager";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";
import type { ProgressError } from "@personalidol/loading-manager/src/ProgressError.type";
import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { UserSettings } from "./UserSettings.type";

export function LoadingScreenScene(
  userSettings: UserSettings,
  effectComposer: EffectComposer,
  dimensionsState: Uint32Array,
  domMessagePort: MessagePort,
  progressMessagePort: MessagePort
): IScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  let _domFatalErrorElementId: null | string = null;
  let _domLoadingScreenElementId: null | string = null;

  const _ambientLight = new AmbientLight(0xffffff, 0.1);
  const _ambientLightUserSettingsManager = BackgroundLightUserSettingsManager(userSettings, _ambientLight);
  const _camera = new PerspectiveCamera();

  _camera.lookAt(0, 0, 0);
  _camera.position.y = 4;
  _camera.position.z = 12;

  const _disposables: Set<DisposableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();
  const _scene = new Scene();
  const _spotLight = new SpotLight(0xffffff);
  const _spotLightUserSettingsManager = ShadowLightUserSettingsManager(userSettings, _spotLight);

  _spotLight.angle = Math.PI / 5;
  _spotLight.decay = 1;
  _spotLight.distance = 16;
  _spotLight.intensity = 1;
  _spotLight.penumbra = 1;
  _spotLight.position.y = 8;
  _spotLight.shadow.camera.near = 0.1;
  _spotLight.shadow.camera.far = 100;

  const _boxGeometry = new BoxGeometry();
  const _boxMaterial = new MeshStandardMaterial({
    color: 0x333333,
    flatShading: true,
  });
  const _boxMesh = new Mesh(_boxGeometry, _boxMaterial);
  const _boxMeshUserSettingsManager = MeshUserSettingsManager(userSettings, _boxMesh);

  _boxMesh.position.y = 4;

  _disposables.add(disposableGeneric(_boxGeometry));
  _disposables.add(disposableMaterial(_boxMaterial));

  const _progressRouter = createRouter({
    error(error: ProgressError): void {
      _boxMaterial.color = new Color(0xff0000);

      const glitchPass = new GlitchPass();

      effectComposer.addPass(glitchPass);
      _unmountables.add(unmountPass(effectComposer, glitchPass));
      _disposables.add(disposableGeneric(glitchPass));

      if (!_domFatalErrorElementId) {
        _domFatalErrorElementId = MathUtils.generateUUID();
      }

      _unmountLoadingScreen();

      domMessagePort.postMessage({
        render: <MessageDOMUIRender<DOMElementsLookup>>{
          id: _domFatalErrorElementId,
          element: "pi-fatal-error",
          props: {
            progressError: error,
          },
        },
      });
    },

    progress(progress: ProgressManagerProgress): void {
      if (_domFatalErrorElementId) {
        // There is a fatal error going on.
        return;
      }

      if (!_domLoadingScreenElementId) {
        _domLoadingScreenElementId = MathUtils.generateUUID();
      }

      domMessagePort.postMessage({
        render: <MessageDOMUIRender<DOMElementsLookup>>{
          id: _domLoadingScreenElementId,
          element: "pi-loading-screen",
          props: {
            progressManagerProgress: progress,
          },
        },
      });
    },
  });

  function _unmountFatalErrorScreen() {
    if (!_domFatalErrorElementId) {
      return;
    }

    domMessagePort.postMessage({
      dispose: <MessageDOMUIDispose>[_domFatalErrorElementId],
    });

    _domFatalErrorElementId = null;
  }

  function _unmountLoadingScreen() {
    if (!_domLoadingScreenElementId) {
      return;
    }

    domMessagePort.postMessage({
      dispose: <MessageDOMUIDispose>[_domLoadingScreenElementId],
    });

    _domLoadingScreenElementId = null;
  }

  function dispose(): void {
    state.isDisposed = true;

    disposeAll(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    progressMessagePort.onmessage = _progressRouter;

    const renderPass = new RenderPass(_scene, _camera);

    effectComposer.addPass(renderPass);
    _unmountables.add(unmountPass(effectComposer, renderPass));
    _disposables.add(disposableGeneric(renderPass));

    _scene.add(_ambientLight);
    _scene.add(_boxMesh);
    _scene.add(_spotLight);

    _unmountables.add(function () {
      _scene.remove(_ambientLight);
      _scene.remove(_boxMesh);
      _scene.remove(_spotLight);
    });
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    _ambientLightUserSettingsManager.preload();
    _boxMeshUserSettingsManager.preload();
    _spotLightUserSettingsManager.preload();

    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    progressMessagePort.onmessage = null;

    _unmountLoadingScreen();
    _unmountFatalErrorScreen();

    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    updateStoreCameraAspect(_camera, dimensionsState);

    _ambientLightUserSettingsManager.update(delta, elapsedTime, tickTimerState);
    _boxMeshUserSettingsManager.update(delta, elapsedTime, tickTimerState);
    _spotLightUserSettingsManager.update(delta, elapsedTime, tickTimerState);

    _boxMesh.rotation.x += delta;
    _boxMesh.rotation.z += delta;

    effectComposer.render(delta);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: true,
    name: "LoadingScreen",
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
