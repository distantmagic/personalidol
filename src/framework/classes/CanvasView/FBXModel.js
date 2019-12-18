// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import { default as FBXModelQuery } from "../Query/FBXModel";
import { default as TextureQuery } from "../Query/Texture";

import type { Group, LoadingManager as THREELoadingManager, Vector3 } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class FBXModel extends CanvasView {
  +angle: number;
  +animationOffset: number;
  +baseUrl: string;
  +group: Group;
  +origin: Vector3;
  +queryBus: QueryBus;
  +scale: number;
  +texture: string;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    canvasViewBag: CanvasViewBag,
    origin: Vector3,
    queryBus: QueryBus,
    group: Group,
    threeLoadingManager: THREELoadingManager,
    baseUrl: string,
    angle: number,
    animationOffset: number,
    scale: number,
    texture: string
  ) {
    super(canvasViewBag);

    this.angle = angle;
    this.animationOffset = animationOffset;
    this.baseUrl = baseUrl;
    this.group = group;
    this.origin = origin;
    this.queryBus = queryBus;
    this.scale = scale;
    this.texture = texture;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const modelQuery = new FBXModelQuery(this.threeLoadingManager, this.baseUrl, `${this.baseUrl}model.fbx`);
    const model = await this.queryBus.enqueue(cancelToken, modelQuery).whenExecuted();

    const textureQuery = new TextureQuery(new THREE.TextureLoader(this.threeLoadingManager), `${this.baseUrl}${this.texture}`);
    const texture = await this.queryBus.enqueue(cancelToken, textureQuery).whenExecuted();

    model.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material.map = texture;
        child.material.needsUpdate = true;
        child.receiveShadow = true;
      }
    });

    model.position.copy(this.origin);
    model.rotation.y = THREE.Math.degToRad(-1 * this.angle);
    model.scale.set(this.scale, this.scale, this.scale);

    this.group.add(model);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }
}
