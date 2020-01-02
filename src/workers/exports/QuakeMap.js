// @flow

import * as THREE from "three";

import bootstrapWorker from "../../framework/helpers/bootstrapWorker";
import JSONRPCResponseData from "../../framework/classes/JSONRPCResponseData";
import quake2three from "../../framework/helpers/quake2three";
import QuakeBrushGeometryBuilder from "../../framework/classes/QuakeBrushGeometryBuilder";
import QuakeMapParser from "../../framework/classes/QuakeMapParser";
import QuakeMapTextureLoader from "../../framework/classes/QuakeMapTextureLoader";
import { default as PlainTextQuery } from "../../framework/classes/Query/PlainText";
import { default as QuakeMapException } from "../../framework/classes/Exception/QuakeMap";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { JSONRPCRequest } from "../../framework/interfaces/JSONRPCRequest";
import type { JSONRPCServer } from "../../framework/interfaces/JSONRPCServer";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QuakeEntity } from "../../framework/interfaces/QuakeEntity";
import type { QuakeMapTextureLoader as QuakeMapTextureLoaderInterface } from "../../framework/interfaces/QuakeMapTextureLoader";
import type { QueryBus } from "../../framework/interfaces/QueryBus";

declare var self: DedicatedWorkerGlobalScope;

const SCENERY_INDOORS = 0;
const SCENERY_OUTDOORS = 1;

async function createGeometryBuffers(cancelToken: CancelToken, className: string, entity: QuakeEntity) {
  const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

  for (let brush of entity.getBrushes()) {
    quakeBrushGeometryBuilder.addBrush(brush);
  }

  const normals = Float32Array.from(quakeBrushGeometryBuilder.getNormals());
  const textures = Float32Array.from(quakeBrushGeometryBuilder.getTexturesIndices());
  const uvs = Float32Array.from(quakeBrushGeometryBuilder.getUvs());
  const vertices = Float32Array.from(quakeBrushGeometryBuilder.getVertices());

  // prettier-ignore
  return new JSONRPCResponseData(
    {
      classname: className,
      normals: normals.buffer,
      texturesIndices: textures.buffer,
      texturesNames: quakeBrushGeometryBuilder.getTexturesNames(),
      uvs: uvs.buffer,
      vertices: vertices.buffer,
    },
    [
      normals.buffer,
      textures.buffer,
      uvs.buffer,
      vertices.buffer
    ]
  );
}

function getEntityOrigin(entity: QuakeEntity): [number, number, number] {
  return quake2three(entity.getOrigin()).toArray();
}

self.onmessage = bootstrapWorker(function(serverCancelToken: CancelToken, loggerBreadcrumbs: LoggerBreadcrumbs, jsonRpcServer: JSONRPCServer, queryBus: QueryBus) {
  const threeLoadingManager = new THREE.LoadingManager();

  jsonRpcServer.returnGenerator(serverCancelToken, "/map", async function*(cancelToken: CancelToken, request: JSONRPCRequest) {
    const breadcrumbs = loggerBreadcrumbs.add("/map");
    const [source: string] = request.getParams();
    const quakeMapQuery = new PlainTextQuery(source);
    const quakeMapContent = await queryBus.enqueue(cancelToken, quakeMapQuery).whenExecuted();
    const quakeMapParser = new QuakeMapParser(breadcrumbs, quakeMapContent);
    const entitiesWithBrushes = [];

    for (let entity of quakeMapParser.parse()) {
      const entityClassName = entity.getClassName();
      const entityProperties = entity.getProperties();
      let entityOrigin;

      switch (entityClassName) {
        case "func_group":
          // this func is primarily for a game logic, but it can also group
          // geometries
          entitiesWithBrushes.push(["func_group", entity]);
          break;
        case "light":
          yield new JSONRPCResponseData({
            classname: entityClassName,
            color: entityProperties.getPropertyByKey("color").getValue(),
            decay: entityProperties.getPropertyByKey("decay").asNumber(),
            light: entityProperties.getPropertyByKey("light").asNumber(),
            origin: getEntityOrigin(entity),
          });
          break;
        case "model_gltf":
          yield new JSONRPCResponseData({
            angle: entityProperties.getPropertyByKey("angle").asNumber(),
            classname: entityClassName,
            model_name: entityProperties.getPropertyByKey("model_name").getValue(),
            model_texture: entityProperties.getPropertyByKey("model_texture").getValue(),
            origin: getEntityOrigin(entity),
            scale: entityProperties.getPropertyByKey("scale").asNumber(),
          });

          break;
        case "model_md2":
          yield new JSONRPCResponseData({
            angle: entityProperties.getPropertyByKey("angle").asNumber(),
            classname: entityClassName,
            model_name: entityProperties.getPropertyByKey("model_name").getValue(),
            origin: getEntityOrigin(entity),
            skin: entityProperties.getPropertyByKey("skin").asNumber(),
          });
          break;
        case "player":
          yield new JSONRPCResponseData({
            classname: entityClassName,
            origin: getEntityOrigin(entity),
          });
          break;
        case "spark_particles":
          yield new JSONRPCResponseData({
            classname: entityClassName,
            origin: getEntityOrigin(entity),
          });
          break;
        case "worldspawn":
          // leave worldspawn at the end for better performance
          // it takes a long time to parse a map file, in the meantime the main
          // thread can load models, etc
          entitiesWithBrushes.push(["worldspawn", entity]);

          if (entityProperties.hasPropertyKey("light")) {
            const sceneryType = entityProperties.getPropertyByKey("scenery").asNumber();

            // prettier-ignore
            switch (sceneryType) {
              case SCENERY_INDOORS:
                yield new JSONRPCResponseData({
                  classname: "light_ambient",
                  light: entityProperties.getPropertyByKey("light").asNumber(),
                });
                break;
              case SCENERY_OUTDOORS:
                yield new JSONRPCResponseData({
                  classname: "light_hemisphere",
                  light: entityProperties.getPropertyByKey("light").asNumber(),
                });
                break;
                default:
                  throw new QuakeMapException(breadcrumbs, `Unknown map scenery type: "${sceneryType}".`);
            }
          }
          if (entityProperties.hasPropertyKey("sounds")) {
            yield new JSONRPCResponseData({
              classname: "sounds",
              sounds: entityProperties.getPropertyByKey("sounds").getValue(),
            });
          }
          break;
        default:
          throw new QuakeMapException(breadcrumbs, `Unsupported entity class name: "${entityClassName}"`);
      }
    }

    for (let [entityClassName, entity] of entitiesWithBrushes) {
      yield await createGeometryBuffers(cancelToken, entityClassName, entity);
    }
  });
});
