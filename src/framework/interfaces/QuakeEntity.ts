import * as THREE from "three";

import Equatable from "src/framework/interfaces/Equatable";
import QuakeBrush from "src/framework/interfaces/QuakeBrush";
import QuakeEntityProperties from "src/framework/interfaces/QuakeEntityProperties";

export default interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrushes(): ReadonlyArray<QuakeBrush>;

  getClassName(): string;

  getOrigin(): THREE.Vector3;

  getProperties(): QuakeEntityProperties;

  hasOrigin(): boolean;

  isOfClass(className: string): boolean;
}
