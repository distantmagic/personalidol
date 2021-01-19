import { Color } from "three/src/math/Color";
import { MathUtils } from "three/src/math/MathUtils";
import { SpotLight } from "three/src/lights/SpotLight";

import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { EntityLightSpotlight } from "@personalidol/personalidol-mapentities/src/EntityLightSpotlight.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityView } from "./EntityView.interface";

export function SpotlightLightView(scene: Scene, entity: EntityLightSpotlight): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _color = new Color(parseInt(entity.color, 16));
  const _spotLight = new SpotLight(_color, entity.intensity);

  function dispose(): void {
    state.isDisposed = false;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_spotLight);
    scene.add(_spotLight.target);
  }

  function preload(): void {
    _spotLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
    _spotLight.target.position.set(entity.origin.x, 0, entity.origin.z);
    _spotLight.decay = entity.decay;
    _spotLight.distance = 512;
    _spotLight.penumbra = 1;
    _spotLight.castShadow = false;
    _spotLight.visible = true;
    _spotLight.shadow.camera.far = 512;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_spotLight);
    scene.remove(_spotLight.target);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `SpotlightLightView("${entity.color}",${entity.decay},${entity.intensity})`,
    needsUpdates: false,
    object3D: _spotLight,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
