import type { Disposable } from "@personalidol/framework/src/Disposable.interface";
import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { PollablePreloading } from "@personalidol/framework/src/PollablePreloading.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityController } from "./EntityController.interface";
import type { EntityControllerBagState } from "./EntityControllerBagState.type";

export interface EntityControllerBag extends Disposable, MainLoopUpdatable, Mountable, Pauseable, PollablePreloading, Preloadable {
  readonly entityControllers: Set<EntityController<AnyEntity>>;
  readonly state: EntityControllerBagState;
}
