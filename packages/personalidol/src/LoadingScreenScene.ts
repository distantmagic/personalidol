import { AmbientLight } from "three/src/lights/AmbientLight";
import { BoxBufferGeometry } from "three/src/geometries/BoxGeometry";
import { Mesh } from "three/src/objects/Mesh";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";
import { SpotLight } from "three/src/lights/SpotLight";

import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { invoke } from "@personalidol/framework/src/invoke";

import type { Disposable } from "@personalidol/framework/src/Disposable.type";
import type { LoadingManagerState } from "@personalidol/framework/src/LoadingManagerState.type";
import type { RendererState } from "@personalidol/framework/src/RendererState.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { Unmountable } from "@personalidol/framework/src/Unmountable.type";

const _clearRendererMessage = {
  render: {
    route: null,
  },
};

export function LoadingScreenScene(domMessagePort: MessagePort, loadingManagerState: LoadingManagerState, rendererState: RendererState): IScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  let _previousComment = "";
  let _previousProgress = 0;

  const _ambientLight = new AmbientLight(0xffffff, 0.1);
  const _camera = new PerspectiveCamera();

  _camera.lookAt(0, 0, 0);
  _camera.position.y = 4;
  _camera.position.z = 12;

  const _disposables: Set<Disposable> = new Set();
  const _unmountables: Set<Unmountable> = new Set();
  const _scene = new Scene();
  const _spotLight = new SpotLight(0xffffff);

  _spotLight.angle = Math.PI / 5;
  _spotLight.castShadow = true;
  _spotLight.decay = 1;
  _spotLight.distance = 16;
  _spotLight.penumbra = 1;
  _spotLight.position.y = 8;
  _spotLight.shadow.camera.near = 0.1;
  _spotLight.shadow.camera.far = 100;

  const _boxGeometry = new BoxBufferGeometry();
  const _boxMaterial = new MeshStandardMaterial({
    color: 0x333333,
    flatShading: true,
  });
  const _boxMesh = new Mesh(_boxGeometry, _boxMaterial);

  _boxMesh.position.y = 4;
  _boxMesh.castShadow = true;
  _boxMesh.receiveShadow = true;

  _disposables.add(disposableGeneric(_boxGeometry));
  _disposables.add(disposableMaterial(_boxMaterial));

  function dispose(): void {
    state.isDisposed = true;

    _disposables.forEach(invoke);
    _disposables.clear();
  }

  function mount(): void {
    state.isMounted = true;

    _previousComment = "";
    _previousProgress = 0;

    rendererState.camera = _camera;
    rendererState.scene = _scene;

    _spotLight.intensity = 0;

    _scene.add(_ambientLight);
    _scene.add(_boxMesh);
    _scene.add(_spotLight);

    _unmountables.add(_unmountFromRenderer);
    _unmountables.add(function () {
      _scene.remove(_ambientLight);
      _scene.remove(_boxMesh);
      _scene.remove(_spotLight);
    });
  }

  function preload(): void {
    // state.isPreloading = true;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    domMessagePort.postMessage(_clearRendererMessage);

    _unmountables.forEach(invoke);
    _unmountables.clear();
  }

  function update(delta: number): void {
    _spotLight.intensity = Math.min(2, _spotLight.intensity + 2 * delta);

    if (_spotLight.intensity > 0.4) {
      _boxMesh.rotation.x += delta;
      _boxMesh.rotation.z += delta;
    }

    rendererState.renderer.shadowMap.needsUpdate = true;

    if (_previousComment === loadingManagerState.comment && _previousProgress === loadingManagerState.progress) {
      return;
    }

    _previousComment = loadingManagerState.comment;
    _previousProgress = loadingManagerState.progress;

    domMessagePort.postMessage({
      render: {
        route: "/loading-screen",
        data: {
          comment: loadingManagerState.comment,
          progress: loadingManagerState.progress,
        },
      },
    });
  }

  function _unmountFromRenderer() {
    rendererState.camera = null;
    rendererState.scene = null;
  }

  return Object.freeze({
    name: "LoadingScreen",
    state: state,

    dispose: dispose,
    preload: preload,
    mount: mount,
    unmount: unmount,
    update: update,
  });
}
