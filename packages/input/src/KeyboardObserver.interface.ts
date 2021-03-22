import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { KeyboardObserverState } from "./KeyboardObserverState.type";

export interface KeyboardObserver extends MainLoopUpdatable, Service {
  readonly isKeyboardObserver: true;
  readonly state: KeyboardObserverState;
}
