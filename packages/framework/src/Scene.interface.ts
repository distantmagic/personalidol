import type { DisposableGeneric } from "./DisposableGeneric.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { SceneState } from "./SceneState.type";

export interface Scene extends DisposableGeneric, MainLoopUpdatable {
  readonly name: string;
  readonly state: SceneState;

  mount(): void;

  preload(): void;

  unmount(): void;
}
