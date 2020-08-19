import { getIntersectingPoint } from "./getIntersectingPoint";
import { isAlmostEqual } from "./isAlmostEqual";
import { isEmptyTexturePlaceholder } from "./isEmptyTexturePlaceholder";
import { marshalVector3 } from "./marshalVector3";
import { triangulateFacePoints } from "./triangulateFacePoints";

import type { Vector3 } from "three";

import type { AtlasTextureDimension } from "@personalidol/texture-loader/src/AtlasTextureDimension.type";

import type { Brush } from "./Brush.type";
import type { HalfSpace } from "./HalfSpace.type";
import type { IntersectingPointsCache } from "./IntersectingPointsCache.type";
import type { TextureDimensionsResolver } from "./TextureDimensionsResolver.type";
import type { TriangleSimple } from "./TriangleSimple.type";

type UV = [number, number];

const PI_HALF = Math.PI / 2;

export function buildGeometryAttributes(brushes: ReadonlyArray<Brush>, resolveTextureDimensions: TextureDimensionsResolver, discardOccluding: null | Vector3 = null) {
  let indexIncrement = 0;
  const indexLookup: {
    [key: string]: number;
  } = {};
  const pointsCache: IntersectingPointsCache = {};

  // BufferGeometry attributes
  const atlasUVStart: Array<number> = [];
  const atlasUVStop: Array<number> = [];
  const indices: Array<number> = [];
  const normals: Array<number> = [];
  const uvs: Array<number> = [];
  const vertices: Array<number> = [];

  for (let brush of brushes) {
    // faces intersections need to be found
    // each face needs to be compared with each other face
    // it's a brute force solution, but it's simple enough and since we are
    // working with the set of at most dozen of faces on average optimization
    // won't matter much in practice
    for (let i = 0; i < brush.halfSpaces.length; i += 1) {
      for (let j = i; j < brush.halfSpaces.length; j += 1) {
        for (let k = j; k < brush.halfSpaces.length; k += 1) {
          // this basically generates combinations without repetitions where
          // order does not matter
          const intersectingPoint = getIntersectingPoint(brush.halfSpaces[i], brush.halfSpaces[j], brush.halfSpaces[k], pointsCache);

          if (intersectingPoint && _isPointInsideBrush(brush, intersectingPoint)) {
            _addUniquePointToBrush(brush, brush.halfSpaces[i].points, intersectingPoint);
            _addUniquePointToBrush(brush, brush.halfSpaces[j].points, intersectingPoint);
            _addUniquePointToBrush(brush, brush.halfSpaces[k].points, intersectingPoint);
          }
        }
      }
    }
  }

  for (let brush of brushes) {
    for (let halfSpace of brush.halfSpaces) {
      if (isEmptyTexturePlaceholder(halfSpace.texture.name)) {
        // no texture means that those vertcies should not be rendered
        continue;
      }

      const normal = halfSpace.plane.normal;

      if (discardOccluding && discardOccluding.angleTo(normal) < PI_HALF) {
        // optionally, do not render vertcies that won't be ever visible by
        // the camera anyway
        continue;
      }

      for (let triangle of triangulateFacePoints(normal, halfSpace.points)) {
        for (let i = 0; i < triangle.length; i += 1) {
          const point = triangle[i];

          const textureDimensions: AtlasTextureDimension = resolveTextureDimensions(halfSpace.texture.name);
          const uv = _createUV(halfSpace, point, textureDimensions, triangle, i);
          const marshaled = _marshalToIndex(halfSpace, point, uv);

          if (indexLookup.hasOwnProperty(marshaled)) {
            indices.push(indexLookup[marshaled]);
          } else {
            indexLookup[marshaled] = indexIncrement;

            atlasUVStart.push(textureDimensions.uvStartU, textureDimensions.uvStartV);
            atlasUVStop.push(textureDimensions.uvStopU, textureDimensions.uvStopV);
            indices.push(indexIncrement);
            normals.push(normal.x, normal.y, normal.z);

            uvs.push(uv[0], uv[1]);
            vertices.push(point.x, point.y, point.z);

            indexIncrement += 1;
          }
        }
      }
    }
  }

  const atlasUVStartTypedArray = Float32Array.from(atlasUVStart);
  const atlasUVStopTypedArray = Float32Array.from(atlasUVStop);
  const indicesTypedArray = Uint32Array.from(indices);
  const normalsTypedArray = Float32Array.from(normals);
  const uvsTypedArray = Float32Array.from(uvs);
  const verticesTypedArray = Float32Array.from(vertices);

  // prettier-ignore
  return {
    atlasUVStart: atlasUVStartTypedArray,
    atlasUVStop: atlasUVStopTypedArray,
    indices: indicesTypedArray,
    normals: normalsTypedArray,
    uvs: uvsTypedArray,
    vertices: verticesTypedArray,
    transferables: [
      atlasUVStartTypedArray.buffer,
      atlasUVStopTypedArray.buffer,
      indicesTypedArray.buffer,
      normalsTypedArray.buffer,
      uvsTypedArray.buffer,
      verticesTypedArray.buffer
    ],
  };
}

function _addUniquePointToBrush(brush: Brush, points: Array<Vector3>, point: Vector3): void {
  if (points.includes(point)) {
    return;
  }

  points.push(point);
}

function _textureWrapU(halfSpace: HalfSpace, textureDimensions: AtlasTextureDimension, u: number): number {
  return (u + halfSpace.texture.offset.x) / textureDimensions.width;
}

function _textureWrapV(halfSpace: HalfSpace, textureDimensions: AtlasTextureDimension, v: number): number {
  return (v + halfSpace.texture.offset.y) / textureDimensions.height;
}

function _createUV(halfSpace: HalfSpace, point: Vector3, textureDimensions: AtlasTextureDimension, triangle: TriangleSimple, i: number): UV {
  const normal = halfSpace.plane.normal;

  // prettier-ignore
  switch (true) {
    case normal.x > normal.y && normal.x > normal.z:
    case normal.x < normal.y && normal.x < normal.z:
      return [
        _textureWrapU(halfSpace, textureDimensions, point.z),
        _textureWrapV(halfSpace, textureDimensions, point.y),
      ];
    case normal.z > normal.x && normal.z > normal.y:
    case normal.z < normal.x && normal.z < normal.y:
      return [
        _textureWrapU(halfSpace, textureDimensions, point.x),
        _textureWrapV(halfSpace, textureDimensions, point.y),
      ];
    case normal.y > normal.x && normal.y > normal.z:
    case normal.y < normal.x && normal.y < normal.z:
    case isAlmostEqual(normal.x, normal.y) && isAlmostEqual(normal.x, normal.z) && normal.x > 0:
      return [
        _textureWrapU(halfSpace, textureDimensions, point.z),
        _textureWrapV(halfSpace, textureDimensions, point.x),
      ];
    default:
      throw new Error("Unable to determine UVs.");
  }
}

/**
 * This is really important, as the given point, which can be a valid
 * halfspaces intersection, can still land outside the brush boundaries
 */
function _isPointInsideBrush(brush: Brush, point: Vector3): boolean {
  for (let halfSpace of brush.halfSpaces) {
    const distanceToPoint = halfSpace.plane.distanceToPoint(point);

    if (distanceToPoint > 0 && !isAlmostEqual(distanceToPoint, 0, 0.5)) {
      return false;
    }
  }

  return true;
}

function _marshalToIndex(halfSpace: HalfSpace, point: Vector3, uv: UV): string {
  return `${halfSpace.texture.name} ${marshalVector3(halfSpace.plane.normal)} ${marshalVector3(point)} ${uv[0]} ${uv[1]}`;
}
