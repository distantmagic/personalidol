import type { Scene } from "./Scene.interface";

export type DirectorState = {
  current: null | Scene;
  isStarted: boolean;
  isTransitioning: boolean;
  next: null | Scene;
};
