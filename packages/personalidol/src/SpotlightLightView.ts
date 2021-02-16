import { Color } from "three/src/math/Color";
import { Group } from "three/src/objects/Group";
import { MathUtils } from "three/src/math/MathUtils";
import { SpotLight } from "three/src/lights/SpotLight";

import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";
import { onlyOne } from "@personalidol/framework/src/onlyOne";

import { useLightShadowUserSettings } from "./useLightShadowUserSettings";
import { useObject3DUserSettings } from "./useObject3DUserSettings";

import type { Scene } from "three/src/scenes/Scene";

import type { View } from "@personalidol/framework/src/View.interface";
import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function SpotlightLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightSpotlight, targetedViews: Set<View>): EntityView {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _color = new Color(parseInt(entity.color, 16));
  const _group = new Group();
  const _spotLight = new SpotLight(_color, entity.intensity);
  const _target: View = onlyOne(targetedViews, `SpotLight must have exactly 1 target, got: "${targetedViews.size}"`);

  _group.add(_spotLight);

  let _groupHasLight: boolean = true;

  function _applyUserSettings(): void {
    useObject3DUserSettings(userSettings, _spotLight);
    useLightShadowUserSettings(userSettings, _spotLight.shadow);

    _spotLight.visible = userSettings.useDynamicLighting;

    if (userSettings.useDynamicLighting && !_groupHasLight) {
      _groupHasLight = true;
      _group.add(_spotLight);
    }

    if (!userSettings.useDynamicLighting && _groupHasLight) {
      _groupHasLight = false;
      _group.remove(_spotLight);
    }
  }

  function dispose(): void {
    state.isDisposed = true;

    disposeWebGLRenderTarget(_spotLight.shadow.map);
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_group);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    _spotLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
    _spotLight.target = _target.object3D;

    const distanceToTarget: number = _spotLight.position.distanceTo(_spotLight.target.position);

    _spotLight.decay = entity.decay;
    _spotLight.distance = 2 * distanceToTarget;
    _spotLight.penumbra = 0.6;
    _spotLight.visible = true;
    _spotLight.shadow.camera.far = _spotLight.distance;

    _applyUserSettings();

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_group);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: true,
    isScene: false,
    isView: true,
    name: `SpotlightLightView("${entity.color}",${entity.decay},${entity.intensity})`,
    needsUpdates: true,
    object3D: _spotLight,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: _applyUserSettings,
  });
}
