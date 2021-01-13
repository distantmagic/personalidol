import { Color } from "three/src/math/Color";
import { MathUtils } from "three/src/math/MathUtils";
import { SpotLight } from "three/src/lights/SpotLight";

import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { EntityLightSpotlight } from "@personalidol/quakemaps/src/EntityLightSpotlight.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function SpotlightLightView(scene: Scene, entity: EntityLightSpotlight): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _color = new Color(parseInt(entity.color, 16));
  const _spotLight = new SpotLight(_color, entity.intensity);

  _spotLight.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
  _spotLight.target.position.set(entity.origin.x, 0, entity.origin.z);
  _spotLight.decay = entity.decay;
  _spotLight.distance = 512;
  _spotLight.penumbra = 1;
  _spotLight.castShadow = false;
  _spotLight.visible = true;
  _spotLight.shadow.camera.far = 512;

  function dispose(): void {
    state.isDisposed = false;

    scene.remove(_spotLight);
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_spotLight);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: false,
    isView: true,
    name: `SpotlightLightView`,
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
