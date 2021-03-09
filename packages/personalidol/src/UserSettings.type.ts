import type { UserSettings as BaseUserSettings } from "@personalidol/framework/src/UserSettings.type";

export type UserSettings = BaseUserSettings & {
  cameraType: "PerspectiveCamera" | "OrthographicCamera";
  devicePixelRatio: number;
  dynamicLightQuality: 0 | 1 | 2 | 4;
  language: string;
  pixelRatio: number;
  shadowMapSize: 512 | 1024 | 2048 | 4096;
  useOffscreenCanvas: boolean;
  useShadows: boolean;
};
