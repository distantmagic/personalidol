import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { SceneState } from "./SceneState.type";

export interface Scene extends MainLoopUpdatable {
  readonly name: string;
  readonly state: SceneState;

  dispose(): void;

  mount(): void;

  preload(): void;

  unmount(): void;
}
