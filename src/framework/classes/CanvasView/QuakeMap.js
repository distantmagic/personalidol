// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

import CanvasView from "../CanvasView";
import { default as QuakeMapQuery } from "../Query/QuakeMap";

import type { LoadingManager as THREELoadingManager, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class QuakeMap extends CanvasView {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +source: string;

  constructor(canvasViewBag: CanvasViewBag, loggerBreadcrumbs: LoggerBreadcrumbs, queryBus: QueryBus, scene: Scene, threeLoadingManager: THREELoadingManager, source: string) {
    super(canvasViewBag);
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.source = source;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const query = new QuakeMapQuery(this.loggerBreadcrumbs.add("QuakeMapQuery"), this.source);
    const quakeMap = await this.queryBus.enqueue(cancelToken, query);

    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    });

    for (let entity of quakeMap.getEntities()) {
      for (let brush of entity.getBrushes()) {
        const vertices = brush.getVertices();
        console.log(vertices);
        const geometry = new ConvexBufferGeometry(vertices);
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
      }
    }
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
