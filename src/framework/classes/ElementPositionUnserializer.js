// @flow

import ElementPosition from "./ElementPosition";

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionUnserializer as ElementPositionUnserializerInterface } from "../interfaces/ElementPositionUnserializer";
import type { ElementPositionSerializedObject } from "../types/ElementPositionSerializedObject";

export default class ElementPositionUnserializer<T: ElementPositionUnit>
  implements ElementPositionUnserializerInterface<T> {
  fromJson(serialized: string): ElementPositionInterface<T> {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: ElementPositionSerializedObject<T>): ElementPositionInterface<T> {
    return new ElementPosition<T>(parsed.x, parsed.y, parsed.z);
  }
}
