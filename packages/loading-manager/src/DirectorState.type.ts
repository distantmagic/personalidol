import type { Scene } from "@personalidol/framework/src/Scene.interface";

export type DirectorState = {
  current: null | Scene;
  isStarted: boolean;
  isTransitioning: boolean;
  next: null | Scene;
};
