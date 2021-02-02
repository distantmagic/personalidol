import { Color } from "three/src/math/Color";
import { Group } from "three/src/objects/Group";
import { MathUtils } from "three/src/math/MathUtils";
import { SpotLight } from "three/src/lights/SpotLight";

import { useLightShadowUserSettings } from "./useLightShadowUserSettings";
import { useObject3DUserSettings } from "./useObject3DUserSettings";

import type { Scene } from "three/src/scenes/Scene";

import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function SpotlightLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightSpotlight, targetedViews: Set<View>): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _color = new Color(parseInt(entity.color, 16));
  const _group = new Group();
  const _spotLight = new SpotLight(_color, entity.intensity);

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

  function _getTarget(): View {
    if (targetedViews.size > 1) {
      throw new Error(`SpotLight can have at most 1 target, got: "${targetedViews.size}"`);
    }

    for (let target of targetedViews) {
      return target;
    }

    throw new Error(`SpotLight expects exactly one target.`);
  }

  function dispose(): void {
    state.isDisposed = false;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_group);
  }

  function preload(): void {
    const target: View = _getTarget();

    _spotLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
    _spotLight.target = target.object3D;

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
    preload: preload,
    unmount: unmount,
    update: _applyUserSettings,
  });
}
