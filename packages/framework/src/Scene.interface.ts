import type { Disposable } from "./Disposable.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Mountable } from "./Mountable.interface";
import type { Pauseable } from "./Pauseable.interface";
import type { Preloadable } from "./Preloadable.interface";
import type { SceneState } from "./SceneState.type";

export interface Scene extends Disposable, MainLoopUpdatable, Mountable, Pauseable, Preloadable {
  readonly isScene: true;
  readonly state: SceneState;
}
