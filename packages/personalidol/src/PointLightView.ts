import { Color } from "three/src/math/Color";
import { Group } from "three/src/objects/Group";
import { MathUtils } from "three/src/math/MathUtils";
import { PointLight } from "three/src/lights/PointLight";

import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";

import { useLightShadowUserSettings } from "./useLightShadowUserSettings";
import { useObject3DUserSettings } from "./useObject3DUserSettings";

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
  const _group = new Group();
  const _pointLight = new PointLight(_color, entity.intensity, 1024);

  _group.add(_pointLight);

  let _groupHasLight: boolean = true;

  function _applyUserSettings(): void {
    useObject3DUserSettings(userSettings, _pointLight);
    useLightShadowUserSettings(userSettings, _pointLight.shadow);
    _pointLight.visible = userSettings.useDynamicLighting;

    if (userSettings.useDynamicLighting && !_groupHasLight) {
      _groupHasLight = true;
      _group.add(_pointLight);
    }

    if (!userSettings.useDynamicLighting && _groupHasLight) {
      _groupHasLight = false;
      _group.remove(_pointLight);
    }
  }

  function dispose(): void {
    state.isDisposed = true;

    disposeWebGLRenderTarget(_pointLight.shadow.map);
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_group);
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

    scene.remove(_group);
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
