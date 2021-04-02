import type { Vector3 } from "three/src/math/Vector3";

import type { AnyEntity } from "./AnyEntity.type";
import type { CharacterViewState } from "./CharacterViewState.type";
import type { EntityView } from "./EntityView.interface";

export interface CharacterView<E extends AnyEntity> extends EntityView<E> {
  readonly isCharacterView: true;
  readonly state: CharacterViewState;

  transition(vec: Vector3): void;
}
