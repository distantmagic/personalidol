import isEmpty from "lodash/isEmpty";

import EventListenerSet from "src/framework/classes/EventListenerSet";
import QuakeBrushGeometryBuilder from "src/framework/classes/QuakeBrushGeometryBuilder";
import QuakeMapParser from "src/framework/classes/QuakeMapParser";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type QuakeBrush from "src/framework/interfaces/QuakeBrush";
import type QuakeEntity from "src/framework/interfaces/QuakeEntity";
import type { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import type { default as IQuakeMapLoader } from "src/framework/interfaces/QuakeMapLoader";

import type QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import type QuakeWorkerBrush from "src/framework/types/QuakeWorkerBrush";

type QuakeBrushClassNames = "func_group" | "worldspawn";

const SCENERY_INDOORS = 0;
const SCENERY_OUTDOORS = 1;

function getEntityOrigin(entity: QuakeEntity): [number, number, number] {
  const origin = entity.getOrigin();

  return [origin.x, origin.y, origin.z];
}

export default class QuakeMapLoader implements IQuakeMapLoader {
  readonly onEntity: IEventListenerSet<[QuakeWorkerAny]>;
  readonly onStaticBrush: IEventListenerSet<[QuakeBrush]>;
  readonly onStaticGeometry: IEventListenerSet<[QuakeWorkerBrush, Transferable[]]>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.onEntity = new EventListenerSet(loggerBreadcrumbs.add("onEntity"));
    this.onStaticBrush = new EventListenerSet(loggerBreadcrumbs.add("onStaticBrush"));
    this.onStaticGeometry = new EventListenerSet(loggerBreadcrumbs.add("onStaticGeometry"));
  }

  async processMapContent(loggerBreadcrumbs: LoggerBreadcrumbs, quakeMapContent: string): Promise<void> {
    const quakeMapParser = new QuakeMapParser(loggerBreadcrumbs.add("QuakeMapParser"), quakeMapContent);

    // standalone entities
    const entitiesWithBrushes: Array<[QuakeBrushClassNames, QuakeEntity]> = [];

    // brushes to be merged in one bigger static geometry
    const worldBrushes: Array<QuakeEntity> = [];

    for (let entity of quakeMapParser.parse()) {
      const entityClassName = entity.getClassName();
      const entityProperties = entity.getProperties();

      switch (entityClassName) {
        case "func_group":
          // this func is primarily for a game logic, but it can also group
          // geometries
          switch (entity.getType()) {
            // "_tb_layer" is the Trenchbroom editor utility to help mapmaker to
            // group map objects, those can be merged with worldspawn geometry
            case "_tb_layer":
              worldBrushes.push(entity);
              break;
            // Grouped objects should be processed as standalone entities,
            // because they can have their own controllers and be handled via
            // triggers. Those can be doors or other animated objects.
            default:
              entitiesWithBrushes.push(["func_group", entity]);
              break;
          }
          break;
        case "light_point":
        case "light_spotlight":
          this.onEntity.notify([
            {
              classname: entityClassName,
              color: entityProperties.getPropertyByKey("color").getValue(),
              decay: entityProperties.getPropertyByKey("decay").asNumber(),
              intensity: entityProperties.getPropertyByKey("intensity").asNumber(),
              origin: getEntityOrigin(entity),
            },
          ]);
          break;
        case "model_gltf":
          this.onEntity.notify([
            {
              angle: entityProperties.getPropertyByKey("angle").asNumber(),
              classname: entityClassName,
              model_name: entityProperties.getPropertyByKey("model_name").getValue(),
              model_texture: entityProperties.getPropertyByKey("model_texture").getValue(),
              origin: getEntityOrigin(entity),
              scale: entityProperties.getPropertyByKey("scale").asNumber(),
            },
          ]);

          break;
        case "model_md2":
          this.onEntity.notify([
            {
              angle: entityProperties.getPropertyByKey("angle").asNumber(),
              classname: entityClassName,
              model_name: entityProperties.getPropertyByKey("model_name").getValue(),
              origin: getEntityOrigin(entity),
              skin: entityProperties.getPropertyByKey("skin").asNumber(),
            },
          ]);
          break;
        case "player":
          this.onEntity.notify([
            {
              classname: entityClassName,
              origin: getEntityOrigin(entity),
            },
          ]);
          break;
        case "spark_particles":
          this.onEntity.notify([
            {
              classname: entityClassName,
              origin: getEntityOrigin(entity),
            },
          ]);
          break;
        case "worldspawn":
          // leave worldspawn at the end for better performance
          // it takes a long time to parse a map file, in the meantime the main
          // thread can load models, etc
          worldBrushes.push(entity);

          if (entityProperties.hasPropertyKey("light")) {
            const sceneryType = entityProperties.getPropertyByKey("scenery").asNumber();

            switch (sceneryType) {
              case SCENERY_INDOORS:
                this.onEntity.notify([
                  {
                    classname: "light_ambient",
                    light: entityProperties.getPropertyByKey("light").asNumber(),
                  },
                ]);
                break;
              case SCENERY_OUTDOORS:
                this.onEntity.notify([
                  {
                    classname: "light_hemisphere",
                    light: entityProperties.getPropertyByKey("light").asNumber(),
                  },
                ]);
                break;
              default:
                throw new QuakeMapException(loggerBreadcrumbs, `Unknown map scenery type: "${sceneryType}".`);
            }
          }
          if (entityProperties.hasPropertyKey("sounds")) {
            this.onEntity.notify([
              {
                classname: "sounds",
                sounds: entityProperties.getPropertyByKey("sounds").getValue(),
              },
            ]);
          }
          break;
        default:
          throw new QuakeMapException(loggerBreadcrumbs, `Unsupported entity class name: "${entityClassName}"`);
      }
    }

    for (let [entityClassName, entity] of entitiesWithBrushes) {
      this.createGeometryBuffers(entityClassName, entity.getBrushes());
    }

    // this is the static world geometry
    const mergedBrushes: Array<QuakeBrush> = [];

    for (let entity of worldBrushes) {
      mergedBrushes.push(...entity.getBrushes());
    }

    if (!isEmpty(mergedBrushes)) {
      this.createGeometryBuffers("worldspawn", mergedBrushes);
    }
  }

  private async createGeometryBuffers(className: QuakeBrushClassNames, brushes: ReadonlyArray<QuakeBrush>) {
    const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

    for (let brush of brushes) {
      this.onStaticBrush.notify([brush]);
      quakeBrushGeometryBuilder.addBrush(brush);
    }

    const indices = Uint32Array.from(quakeBrushGeometryBuilder.getIndices());
    const normals = Float32Array.from(quakeBrushGeometryBuilder.getNormals());
    const textures = Float32Array.from(quakeBrushGeometryBuilder.getTexturesIndices());
    const uvs = Float32Array.from(quakeBrushGeometryBuilder.getUvs());
    const vertices = Float32Array.from(quakeBrushGeometryBuilder.getVertices());

    // prettier-ignore
    this.onStaticGeometry.notify([
      {
        classname: className,
        indices: indices.buffer,
        normals: normals.buffer,
        texturesIndices: textures.buffer,
        texturesNames: quakeBrushGeometryBuilder.getTexturesNames(),
        uvs: uvs.buffer,
        vertices: vertices.buffer,
      },
      [
        indices.buffer,
        normals.buffer,
        textures.buffer,
        uvs.buffer,
        vertices.buffer
      ]
    ]);
  }
}
