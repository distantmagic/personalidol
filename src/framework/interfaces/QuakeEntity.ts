import * as THREE from "three";

import Equatable from "src/framework/interfaces/Equatable";
import QuakeBrush from "src/framework/interfaces/QuakeBrush";
import QuakeEntityProperties from "src/framework/interfaces/QuakeEntityProperties";

import QuakeEntityClassName from "src/framework/types/QuakeEntityClassName";
import QuakeEntityType from "src/framework/types/QuakeEntityType";

export default interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrushes(): ReadonlyArray<QuakeBrush>;

  getClassName(): QuakeEntityClassName;

  getOrigin(): THREE.Vector3;

  getProperties(): QuakeEntityProperties;

  getType(): QuakeEntityType;

  hasOrigin(): boolean;

  isOfClass(className: string): boolean;
}
