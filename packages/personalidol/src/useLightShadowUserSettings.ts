import { disposeWebGLRenderTarget } from "@personalidol/framework/src/disposeWebGLRenderTarget";

import type { LightShadow } from "three/src/lights/LightShadow";

import type { UserSettings } from "./UserSettings.type";

export function useLightShadowUserSettings(userSettings: UserSettings, shadow: LightShadow): void {
  if (shadow.mapSize.height === userSettings.shadowMapSize) {
    return;
  }

  disposeWebGLRenderTarget(shadow.map);

  // Force shadow map to be recreated.
  // @ts-ignore
  shadow.map = null;

  shadow.mapSize.height = userSettings.shadowMapSize;
  shadow.mapSize.width = userSettings.shadowMapSize;
}
