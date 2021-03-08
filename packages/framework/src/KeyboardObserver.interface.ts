import type { KeyboardObserverState } from "./KeyboardObserverState.type";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface KeyboardObserver extends MainLoopUpdatable, Service {
  readonly isKeyboardObserver: true;
  readonly state: KeyboardObserverState;
}
