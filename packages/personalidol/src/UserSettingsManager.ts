import { castsShadow } from "@personalidol/framework/src/castsShadow";
import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";
import { isLight } from "@personalidol/framework/src/isLight";
import { isMaterial } from "@personalidol/framework/src/isMaterial";
import { isMesh } from "@personalidol/framework/src/isMesh";

import type { Light } from "three/src/lights/Light";
import type { Mesh } from "three/src/objects/Mesh";
import type { Object3D } from "three/src/core/Object3D";

import type { UserSettings } from "./UserSettings.type";
import type { UserSettingsManager as IUserSettingsManager } from "./UserSettingsManager.interface";

const _lightDefaultIntensity: WeakMap<Light, number> = new WeakMap();

export function UserSettingsManager(userSettings: UserSettings, object3D: Object3D): IUserSettingsManager {
  let _defaultLightIntensity: undefined | number = 0;
  let _lastAppliedVersion: number = -1;
  let _useShadows: boolean = false;

  function _applyLightSettings(light: Light): void {
    if (castsShadow(light)) {
      if (!light.castShadow && _useShadows) {
        disposeWebGLRenderTarget(light.shadow.map);
      }

      light.visible = userSettings.useDynamicLighting;
      light.castShadow = _useShadows;

      return;
    }

    if (!_lightDefaultIntensity.has(light)) {
      _lightDefaultIntensity.set(light, light.intensity);
    }

    if (userSettings.useDynamicLighting) {
      _defaultLightIntensity = _lightDefaultIntensity.get(light);

      if ("number" !== typeof _defaultLightIntensity) {
        throw new Error("Unable to retrieve default light intensity.");
      }

      light.intensity = _defaultLightIntensity;
    } else {
      light.intensity = 1;
    }
  }

  function _applyMeshSettings(mesh: Mesh): void {
    let _needsUpdate = mesh.castShadow !== _useShadows || mesh.receiveShadow !== _useShadows;

    mesh.castShadow = _useShadows;
    mesh.receiveShadow = _useShadows;

    if (_needsUpdate && isMaterial(mesh.material)) {
      mesh.material.needsUpdate = true;
    }
  }

  function _applySettings(): void {
    if (userSettings.version <= _lastAppliedVersion) {
      return;
    }

    _lastAppliedVersion = userSettings.version;
    _useShadows = userSettings.useDynamicLighting && userSettings.useShadows;

    if (isLight(object3D)) {
      _applyLightSettings(object3D);
    }

    if (isMesh(object3D)) {
      _applyMeshSettings(object3D);
    }
  }

  return Object.freeze({
    isUserSettingsManager: true,

    preload: _applySettings,
    update: _applySettings,
  });
}
