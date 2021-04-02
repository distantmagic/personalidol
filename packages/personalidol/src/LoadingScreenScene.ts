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
import { flush } from "@personalidol/framework/src/flush";
import { GlitchPass } from "@personalidol/three-modules/src/postprocessing/GlitchPass";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";
import { updatePerspectiveCameraAspect } from "@personalidol/framework/src/updatePerspectiveCameraAspect";

import type { Logger } from "loglevel";

import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { GenericCallback } from "@personalidol/framework/src/GenericCallback.type";
import type { MessageProgressError } from "@personalidol/framework/src/MessageProgressError.type";
import type { ProgressManagerState } from "@personalidol/framework/src/ProgressManagerState.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { UserSettings } from "./UserSettings.type";

export function LoadingScreenScene(
  logger: Logger,
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

  const _disposables: Set<GenericCallback> = new Set();
  const _unmountables: Set<GenericCallback> = new Set();

  const _ambientLight = new AmbientLight(0xffffff, 0.1);
  const _camera = new PerspectiveCamera();

  _camera.lookAt(0, 0, 0);
  _camera.position.y = 4;
  _camera.position.z = 12;

  const _scene = new Scene();
  const _spotLight = new SpotLight(0xffffff);

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

  _boxMesh.position.y = 4;

  _disposables.add(disposableGeneric(_boxGeometry));
  _disposables.add(disposableMaterial(_boxMaterial));

  let _isProgressErrorHandled: boolean = false;

  const _progressRouter = createRouter({
    progress(progressState: ProgressManagerState): void {
      if (progressState.errors.length < 1 || _isProgressErrorHandled) {
        return;
      }

      _onProgressError(progressState.errors);
    },
  });

  function _onProgressError(errors: ReadonlyArray<MessageProgressError>): void {
    _isProgressErrorHandled = true;

    const glitchPass = new GlitchPass();

    _boxMaterial.color = new Color(0xff0000);

    effectComposer.addPass(glitchPass);

    _unmountables.add(unmountPass(effectComposer, glitchPass));
    _disposables.add(disposableGeneric(glitchPass));
  }

  function dispose(): void {
    state.isDisposed = true;

    flush(_disposables);
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
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    progressMessagePort.onmessage = null;

    flush(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    updatePerspectiveCameraAspect(dimensionsState, _camera);

    _boxMesh.rotation.x += delta;
    _boxMesh.rotation.z += delta;

    effectComposer.render(delta);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isMountable: true,
    isPreloadable: true,
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
