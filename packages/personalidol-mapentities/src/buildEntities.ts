import { buildGeometryAttributes } from "@personalidol/quakemaps/src/buildGeometryAttributes";
import { UnmarshalException } from "@personalidol/quakemaps/src/UnmarshalException";
import { unmarshalVector3 } from "@personalidol/quakemaps/src/unmarshalVector3";

import type { Vector3 } from "three";

import type { Brush } from "@personalidol/quakemaps/src/Brush.type";
import type { EntitySketch } from "@personalidol/quakemaps/src/EntitySketch.type";
import type { TextureDimensionsResolver } from "@personalidol/quakemaps/src/TextureDimensionsResolver.type";
import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { EntityAny } from "./EntityAny.type";

const SCENERY_INDOORS = 0;
const SCENERY_OUTDOORS = 1;
const _transferablesEmpty: [] = [];

function _getEntityOrigin(filename: string, entity: EntitySketch): Vector3Simple {
  if ("string" !== typeof entity.properties.origin) {
    throw new UnmarshalException(filename, 0, "Entity does not have an origin but it was expected.");
  }

  const threeVector3 = unmarshalVector3(filename, 0, entity.properties.origin);

  return {
    x: threeVector3.x,
    y: threeVector3.y,
    z: threeVector3.z,
  };
}

export function* buildEntities(
  filename: string,
  entitySketches: ReadonlyArray<EntitySketch>,
  resolveTextureDimensions: TextureDimensionsResolver,
  discardOccluding: null | Vector3 = null
): Generator<EntityAny> {
  // brushes to be merged into the bigger static geometry
  const worldBrushes: Array<EntitySketch> = [];

  for (let entity of entitySketches) {
    const entityClassName = String(entity.properties.classname);
    const entityType = String(entity.properties._tb_type);

    switch (entityClassName) {
      case "func_group":
        // this func is primarily for a game logic, but it can also group
        // geometries
        switch (entityType) {
          // "_tb_layer" is the Trenchbroom editor utility to help mapmaker to
          // group map objects, those can be merged with worldspawn geometry
          case "_tb_layer":
            worldBrushes.push(entity);
            break;
          // Grouped objects should be processed as standalone entities,
          // because they can have their own controllers and be handled via
          // triggers. Those can be doors or other animated objects.
          // Do not discard occluding faces on `func_group` since they may be
          // rotating, animating, etc.
          default:
            yield {
              classname: entityClassName,
              ...buildGeometryAttributes(entity.brushes, resolveTextureDimensions, null),
            };
            break;
        }
        break;
      case "light_point":
      case "light_spotlight":
        yield {
          classname: entityClassName,
          color: entity.properties.color,
          decay: Number(entity.properties.decay),
          intensity: Number(entity.properties.intensity),
          origin: _getEntityOrigin(filename, entity),
          transferables: _transferablesEmpty,
        };
        break;
      case "model_gltf":
        yield {
          angle: Number(entity.properties.angle),
          classname: entityClassName,
          model_name: entity.properties.model_name,
          model_texture: entity.properties.model_texture,
          origin: _getEntityOrigin(filename, entity),
          scale: Number(entity.properties.scale),
          transferables: _transferablesEmpty,
        };

        break;
      case "model_md2":
        yield {
          angle: Number(entity.properties.angle),
          classname: entityClassName,
          model_name: entity.properties.model_name,
          origin: _getEntityOrigin(filename, entity),
          skin: Number(entity.properties.skin),
          transferables: _transferablesEmpty,
        };
        break;
      case "player":
        yield {
          classname: entityClassName,
          origin: _getEntityOrigin(filename, entity),
          transferables: _transferablesEmpty,
        };
        break;
      case "scripted_block":
        yield {
          classname: entityClassName,
          controller: entity.properties.controller,
          ...buildGeometryAttributes(entity.brushes, resolveTextureDimensions, null),
        };
        break;
      case "spark_particles":
        yield {
          classname: entityClassName,
          origin: _getEntityOrigin(filename, entity),
          transferables: _transferablesEmpty,
        };
        break;
      case "worldspawn":
        // leave worldspawn at the end for better performance
        // it takes a long time to parse a map file, in the meantime the main
        // thread can load models, etc
        worldBrushes.push(entity);

        if (entity.properties.hasOwnProperty("light")) {
          const sceneryType = Number(entity.properties.scenery);

          switch (sceneryType) {
            case SCENERY_INDOORS:
              yield {
                classname: "light_ambient",
                light: Number(entity.properties.light),
                transferables: _transferablesEmpty,
              };
              break;
            case SCENERY_OUTDOORS:
              yield {
                classname: "light_hemisphere",
                light: Number(entity.properties.light),
                transferables: _transferablesEmpty,
              };
              break;
            default:
              throw new UnmarshalException(filename, 0, `Unknown map scenery type: "${sceneryType}".`);
          }
        }
        if (entity.properties.hasOwnProperty("sounds")) {
          yield {
            classname: "sounds",
            sounds: entity.properties.sounds,
            transferables: _transferablesEmpty,
          };
        }
        break;
      default:
        throw new UnmarshalException(filename, 0, `Unknown entity class: "${entityClassName}"`);
    }
  }

  // this is the static world geometry
  const mergedBrushes: Array<Brush> = [];

  for (let entity of worldBrushes) {
    mergedBrushes.push(...entity.brushes);
  }

  if (mergedBrushes.length < 0) {
    return;
  }

  yield {
    classname: "worldspawn",
    ...buildGeometryAttributes(mergedBrushes, resolveTextureDimensions, discardOccluding),
  };
}
