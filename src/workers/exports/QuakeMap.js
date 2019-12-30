// @flow

import CancelToken from "../../framework/classes/CancelToken";
import JSONRPCResponseData from "../../framework/classes/JSONRPCResponseData";
import JSONRPCServer from "../../framework/classes/JSONRPCServer";
import LoggerBreadcrumbs from "../../framework/classes/LoggerBreadcrumbs";
import quake2three from "../../framework/helpers/quake2three";
import QuakeBrushGeometryBuilder from "../../framework/classes/QuakeBrushGeometryBuilder";
import QuakeMapParser from "../../framework/classes/QuakeMapParser";
import { default as PlainTextQuery } from "../../framework/classes/Query/PlainText";
import { default as QuakeMapException } from "../../framework/classes/Exception/QuakeMap";

import type { CancelToken as CancelTokenInterface } from "../../framework/interfaces/CancelToken";
import type { JSONRPCRequest } from "../../framework/interfaces/JSONRPCRequest";

declare var self: DedicatedWorkerGlobalScope;

const SCENERY_INDOORS = 0;
const SCENERY_OUTDOORS = 1;

const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker", "QuakeMap"]);
const cancelToken = new CancelToken(loggerBreadcrumbs);
const jsonRpcServer = new JSONRPCServer(loggerBreadcrumbs, self.postMessage.bind(self));

jsonRpcServer.returnGenerator(cancelToken, "/map", async function*(cancelToken: CancelTokenInterface, request: JSONRPCRequest) {
  const breadcrumbs = loggerBreadcrumbs.add("/map");
  const [source: string] = request.getParams();
  const quakeMapQuery = new PlainTextQuery(source);
  const quakeMapContent = await quakeMapQuery.execute(cancelToken);
  const quakeMapParser = new QuakeMapParser(breadcrumbs, quakeMapContent);
  const worldspawn = [];

  for (let entity of quakeMapParser.parse()) {
    const entityClassName = entity.getClassName();
    const entityProperties = entity.getProperties();
    let entityOrigin;

    switch (entityClassName) {
      case "func_group":
        // this is the editor entity, can be ignored here
        break;
      case "light":
        entityOrigin = quake2three(entity.getOrigin());

        yield new JSONRPCResponseData({
          classname: entityClassName,
          color: entityProperties.getPropertyByKey("color").getValue(),
          decay: entityProperties.getPropertyByKey("decay").asNumber(),
          light: entityProperties.getPropertyByKey("light").asNumber(),
          origin: [entityOrigin.x, entityOrigin.y, entityOrigin.z],
        });
        break;
      case "model_fbx":
        entityOrigin = quake2three(entity.getOrigin());

        yield new JSONRPCResponseData({
          angle: entityProperties.getPropertyByKey("angle").asNumber(),
          classname: entityClassName,
          model_name: entityProperties.getPropertyByKey("model_name").getValue(),
          model_texture: entityProperties.getPropertyByKey("model_texture").getValue(),
          origin: [entityOrigin.x, entityOrigin.y, entityOrigin.z],
          scale: entityProperties.getPropertyByKey("scale").asNumber(),
        });

        break;
      case "model_md2":
        entityOrigin = quake2three(entity.getOrigin());

        yield new JSONRPCResponseData({
          angle: entityProperties.getPropertyByKey("angle").asNumber(),
          classname: entityClassName,
          model_name: entityProperties.getPropertyByKey("model_name").getValue(),
          origin: [entityOrigin.x, entityOrigin.y, entityOrigin.z],
          skin: entityProperties.getPropertyByKey("skin").asNumber(),
        });
        break;
      case "player":
        break;
      case "spark_particles":
        entityOrigin = quake2three(entity.getOrigin());

        yield new JSONRPCResponseData({
          classname: entityClassName,
          origin: [entityOrigin.x, entityOrigin.y, entityOrigin.z],
        });
        break;
      case "worldspawn":
        // leave worldspawn at the end for better performance
        // it takes a long time to parse a map file, in the meantime the main
        // thread can load models, etc
        worldspawn.push(entity);

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

  for (let entity of worldspawn) {
    const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

    for (let brush of entity.getBrushes()) {
      quakeBrushGeometryBuilder.addBrush(brush);
    }

    const normals = Float32Array.from(quakeBrushGeometryBuilder.getNormals());
    const textures = Float32Array.from(quakeBrushGeometryBuilder.getTexturesIndices());
    const uvs = Float32Array.from(quakeBrushGeometryBuilder.getUvs());
    const vertices = Float32Array.from(quakeBrushGeometryBuilder.getVertices());

    // prettier-ignore
    yield new JSONRPCResponseData(
      {
        classname: "worldspawn",
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
});

self.onmessage = jsonRpcServer.useMessageHandler(cancelToken);
