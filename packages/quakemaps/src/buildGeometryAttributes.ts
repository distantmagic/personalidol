import { getIntersectingPoint } from "./getIntersectingPoint";
import { isAlmostEqual } from "./isAlmostEqual";
import { marshalVector3 } from "./marshalVector3";
import { triangulateFacePoints } from "./triangulateFacePoints";

import type { Vector3 as IVector3 } from "three";

import type { Brush } from "./Brush.type";
import type { IntersectingPointsCache } from "./IntersectingPointsCache.type";

const PI_HALF = Math.PI / 2;
const TEXTURE_EMPTY = "__TB_empty";
const TEXTURE_SIZE = 512;

export function buildGeometryAttributes(brushes: ReadonlyArray<Brush>, discardOccluding: null | IVector3 = null) {
  let indexIncrement = 0;
  const indexLookup: {
    [key: string]: number;
  } = {};
  const pointsCache: IntersectingPointsCache = {};
  const textureNames: Array<string> = [];

  // BufferGeometry attributes
  const indices: Array<number> = [];
  const normals: Array<number> = [];
  const textures: Array<number> = [];
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
      if (TEXTURE_EMPTY === halfSpace.texture.name) {
        // no texture means that those vertcies should not be rendered
        continue;
      }

      const normal = halfSpace.plane.normal;

      if (discardOccluding && discardOccluding.angleTo(normal) < PI_HALF) {
        // optionally, do not render vertcies that won't be ever visible by
        // the camera anyway
        continue;
      }

      if (!textureNames.includes(halfSpace.texture.name)) {
        textureNames.push(halfSpace.texture.name);
      }

      const textureIndex = textureNames.indexOf(halfSpace.texture.name);

      for (let triangle of triangulateFacePoints(normal, halfSpace.points)) {
        for (let point of triangle) {
          const marshaled = _marshalToIndex(normal, point);

          if (indexLookup.hasOwnProperty(marshaled)) {
            indices.push(indexLookup[marshaled]);
          } else {
            indexLookup[marshaled] = indexIncrement;

            indices.push(indexIncrement);
            vertices.push(point.x, point.y, point.z);
            normals.push(normal.x, normal.y, normal.z);
            textures.push(textureIndex);

            switch (true) {
              case normal.x > normal.y && normal.x > normal.z:
              case normal.x < normal.y && normal.x < normal.z:
                uvs.push(point.z / TEXTURE_SIZE, point.y / TEXTURE_SIZE);
                break;
              case normal.z > normal.x && normal.z > normal.y:
              case normal.z < normal.x && normal.z < normal.y:
                uvs.push(point.x / TEXTURE_SIZE, point.y / TEXTURE_SIZE);
                break;
              case normal.y > normal.x && normal.y > normal.z:
              case normal.y < normal.x && normal.y < normal.z:
              case isAlmostEqual(normal.x, normal.y) && isAlmostEqual(normal.x, normal.z) && normal.x > 0:
                uvs.push(point.z / TEXTURE_SIZE, point.x / TEXTURE_SIZE);
                break;
              default:
                throw new Error("Unable to determine UVs.");
            }

            indexIncrement += 1;
          }
        }
      }
    }
  }

  const indicesTypedArray = Uint32Array.from(indices);
  const normalsTypedArray = Float32Array.from(normals);
  const texturesTypedArray = Float32Array.from(textures);
  const uvsTypedArray = Float32Array.from(uvs);
  const verticesTypedArray = Float32Array.from(vertices);

  // prettier-ignore
  return {
    indices: indicesTypedArray,
    normals: normalsTypedArray,
    textureNames: textureNames,
    textures: texturesTypedArray,
    uvs: uvsTypedArray,
    vertices: verticesTypedArray,
    transferables: [
      indicesTypedArray.buffer,
      normalsTypedArray.buffer,
      texturesTypedArray.buffer,
      uvsTypedArray.buffer,
      verticesTypedArray.buffer
    ],
  };
}

function _addUniquePointToBrush(brush: Brush, points: Array<IVector3>, point: IVector3): void {
  if (points.includes(point)) {
    return;
  }

  points.push(point);
}

/**
 * This is really important, as the given point, which can be a valid
 * halfspaces intersection, can still land outside the brush boundaries
 */
function _isPointInsideBrush(brush: Brush, point: IVector3): boolean {
  for (let halfSpace of brush.halfSpaces) {
    const distanceToPoint = halfSpace.plane.distanceToPoint(point);

    if (distanceToPoint > 0 && !isAlmostEqual(distanceToPoint, 0)) {
      return false;
    }
  }

  return true;
}

function _marshalToIndex(normal: IVector3, point: IVector3): string {
  return `${marshalVector3(normal)} ${marshalVector3(point)}`;
}
