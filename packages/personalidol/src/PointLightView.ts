import { Color } from "three/src/math/Color";
import { MathUtils } from "three/src/math/MathUtils";
import { PointLight } from "three/src/lights/PointLight";

import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";

import type { Scene } from "three/src/scenes/Scene";

import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityLightPoint } from "./EntityLightPoint.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function PointLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightPoint): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _color = new Color(parseInt(entity.color, 16));
  const _pointLight = new PointLight(_color, entity.intensity, 1024);

  let _userSettingsLastApplied: number = -1;

  function _applyUserSettings(): void {
    if (_userSettingsLastApplied >= userSettings.lastUpdate) {
      return;
    }

    _pointLight.castShadow = userSettings.useShadows;

    if (_pointLight.shadow.mapSize.height !== userSettings.shadowMapSize) {
      disposeWebGLRenderTarget(_pointLight.shadow.map);

      // Force shadow map to be recreated.
      // @ts-ignore
      _pointLight.shadow.map = null;
    }

    _pointLight.shadow.mapSize.height = userSettings.shadowMapSize;
    _pointLight.shadow.mapSize.width = userSettings.shadowMapSize;

    _userSettingsLastApplied = userSettings.lastUpdate;
  }

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_pointLight);
  }

  function preload(): void {
    _pointLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
    _pointLight.decay = entity.decay;
    _pointLight.shadow.camera.far = 1024;

    _applyUserSettings();

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_pointLight);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `PointLightView("${entity.color}",${entity.decay},${entity.intensity})`,
    needsUpdates: false,
    state: state,
    object3D: _pointLight,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: _applyUserSettings,
  });
}
