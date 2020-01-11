import { Vector3 } from "three";

import { Equatable } from "./Equatable";
import { QuakeBrush } from "./QuakeBrush";
import { QuakeEntityProperties } from "./QuakeEntityProperties";

export interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrushes(): ReadonlyArray<QuakeBrush>;

  getClassName(): string;

  getOrigin(): Vector3;

  getProperties(): QuakeEntityProperties;

  hasOrigin(): boolean;

  isOfClass(className: string): boolean;
}
