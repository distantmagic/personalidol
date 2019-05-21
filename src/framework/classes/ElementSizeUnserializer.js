// @flow

import ElementSize from "./ElementSize";

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";

export default class ElementSizeUnserializer<T: ElementPositionUnit> implements ElementSizeUnserializerInterface<T> {
  fromJson(serialized: string): ElementSizeInterface<T> {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: ElementSizeSerializedObject<T>): ElementSizeInterface<T> {
    return new ElementSize<T>(parsed.width, parsed.height, parsed.depth);
  }
}
