import type { Object3D } from "three/src/core/Object3D";

import type { UserSettings } from "./UserSettings.type";

export function useObject3DUserSettings(userSettings: UserSettings, object3D: Object3D) {
  object3D.castShadow = userSettings.useShadows;
  object3D.receiveShadow = userSettings.useShadows;
}
