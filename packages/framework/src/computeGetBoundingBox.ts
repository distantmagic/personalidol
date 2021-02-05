import type { Box3 } from "three/src/math/Box3";
import type { BufferGeometry } from "three/src/core/BufferGeometry";

export function computeGetBoundingBox(bufferGeometry: BufferGeometry): Box3 {
  let _box3: null | Box3 = bufferGeometry.boundingBox;

  if (_box3) {
    return _box3;
  }

  bufferGeometry.computeBoundingBox();

  _box3 = bufferGeometry.boundingBox;

  if (!_box3) {
    throw new Error("Geometry is unable to compute bounding box.");
  }

  return _box3;
}
