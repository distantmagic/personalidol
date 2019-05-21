// @flow

import ElementRotation from "./ElementRotation";

import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { ElementRotation as ElementRotationInterface } from "../interfaces/ElementRotation";
import type { ElementRotationUnserializer as ElementRotationUnserializerInterface } from "../interfaces/ElementRotationUnserializer";
import type { ElementRotationSerializedObject } from "../types/ElementRotationSerializedObject";

export default class ElementRotationUnserializer<T: ElementRotationUnit>
  implements ElementRotationUnserializerInterface<T> {
  fromJson(serialized: string): ElementRotationInterface<T> {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: ElementRotationSerializedObject<T>): ElementRotationInterface<T> {
    return new ElementRotation<T>(parsed.x, parsed.y, parsed.z);
  }
}
