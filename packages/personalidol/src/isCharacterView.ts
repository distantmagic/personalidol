import type { AnyEntity } from "./AnyEntity.type";
import type { CharacterView } from "./CharacterView.interface";
import type { EntityView } from "./EntityView.interface";

export function isCharacterView<E extends AnyEntity>(view: EntityView<E>): view is CharacterView<E> {
  return true === (view as CharacterView<E>).isCharacterView;
}
