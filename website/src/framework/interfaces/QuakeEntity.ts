import type * as THREE from "three";

import type QuakeEntityClassName from "src/framework/enums/QuakeEntityClassName";

import type Equatable from "src/framework/interfaces/Equatable";
import type QuakeBrush from "src/framework/interfaces/QuakeBrush";
import type QuakeEntityProperties from "src/framework/interfaces/QuakeEntityProperties";

import type QuakeEntityType from "src/framework/types/QuakeEntityType";

export default interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrushes(): ReadonlyArray<QuakeBrush>;

  getClassName(): QuakeEntityClassName;

  getOrigin(): THREE.Vector3;

  getProperties(): QuakeEntityProperties;

  getType(): QuakeEntityType;

  hasOrigin(): boolean;

  isOfClass(className: string): boolean;
}
