import type { ArgumentCallback } from "./ArgumentCallback.type";
import type { Nameable } from "./Nameable.interface";

export interface ServiceBuilder<D> extends Nameable {
  readonly dependencies: Partial<D>;
  readonly onready: Set<ArgumentCallback<D>>;

  isReady(): boolean;

  setDependency<K extends keyof D>(key: K, dependency: D[K]): void;
}
