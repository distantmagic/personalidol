import type { Vector3 } from "three/src/math/Vector3";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityView } from "./EntityView.interface";

export interface CharacterView<E extends AnyEntity> extends EntityView<E> {
  readonly isCharacterView: true;

  transition(vec: Vector3): void;
}
