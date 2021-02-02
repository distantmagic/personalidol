import { MathUtils } from "three/src/math/MathUtils";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { UserSettings } from "./UserSettings.type";
import type { WebGLRendererUserSettingsManager as IWebGLRendererUserSettingsManager } from "./WebGLRendererUserSettingsManager.interface";

export function WebGLRendererUserSettingsManager(userSettings: UserSettings, renderer: WebGLRenderer): IWebGLRendererUserSettingsManager {
  function start() {}

  function stop() {}

  function update() {
    // renderer.gammaOutput = true;
    // renderer.gammaFactor = 2.2;
    renderer.shadowMap.enabled = userSettings.useShadows;
    renderer.shadowMap.autoUpdate = userSettings.useShadows;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "WebGLRendererUserSettingsManager",

    start: start,
    stop: stop,
    update: update,
  });
}
