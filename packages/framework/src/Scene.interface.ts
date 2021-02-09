import type { Mountable } from "./Mountable.interface";
import type { Pauseable } from "./Pauseable.interface";
import type { SceneState } from "./SceneState.type";

export interface Scene extends Mountable, Pauseable {
  readonly isScene: true;
  readonly state: SceneState;
}
