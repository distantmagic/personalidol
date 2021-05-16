import type { Disposable } from "@personalidol/framework/src/Disposable.interface";
import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityView } from "./EntityView.interface";

export interface EntityController<E extends AnyEntity>
  extends Disposable,
    MainLoopUpdatable,
    Mountable,
    Pauseable,
    Preloadable {
  readonly state: EntityControllerState;
  readonly view: EntityView<E>;
  readonly isEntityController: true;
}
