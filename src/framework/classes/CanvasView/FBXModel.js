// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import { default as FBXModelQuery } from "../Query/FBXModel";
import { default as TextureQuery } from "../Query/Texture";

import type { Group, LoadingManager as THREELoadingManager, Material, Mesh, Object3D, Vector3 } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QueryBus } from "../../interfaces/QueryBus";

type WorkerFBXModel = {|
  +angle: number,
  +classname: "model_fbx",
  +model_name: string,
  +model_texture: string,
  +origin: [number, number, number],
  +scale: number,
|};

function getMesh(model: Object3D): Mesh<BufferGeometry, Material> {
  for (let child of model.children) {
    if (child instanceof THREE.Mesh) {
      return child;
    }
  }

  throw new Error("Could not find mesh.");
}

export default class FBXModel extends CanvasView {
  +animationOffset: number;
  +baseUrl: string;
  +entities: $ReadOnlyArray<WorkerFBXModel>;
  +group: Group;
  +queryBus: QueryBus;
  +texture: string;
  +threeLoadingManager: THREELoadingManager;
  mesh: ?Object3D;

  constructor(
    canvasViewBag: CanvasViewBag,
    queryBus: QueryBus,
    group: Group,
    threeLoadingManager: THREELoadingManager,
    baseUrl: string,
    texture: string,
    animationOffset: number,
    entities: $ReadOnlyArray<WorkerFBXModel>
  ) {
    super(canvasViewBag);

    this.animationOffset = animationOffset;
    this.baseUrl = baseUrl;
    this.entities = entities;
    this.group = group;
    this.mesh = null;
    this.queryBus = queryBus;
    this.texture = texture;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const modelQuery = new FBXModelQuery(this.threeLoadingManager, this.baseUrl, `${this.baseUrl}model.fbx`);
    const model: Object3D = await this.queryBus.enqueue(cancelToken, modelQuery).whenExecuted();

    const textureQuery = new TextureQuery(new THREE.TextureLoader(this.threeLoadingManager), `${this.baseUrl}${this.texture}`);
    const texture = await this.queryBus.enqueue(cancelToken, textureQuery).whenExecuted();

    const baseMesh = getMesh(model);
    const boundingBox = new THREE.Box3();

    boundingBox.setFromBufferAttribute(baseMesh.geometry.attributes.position);

    baseMesh.material.map = texture;
    baseMesh.material.needsUpdate = true;

    console.log(baseMesh.material);

    const mesh = new THREE.InstancedMesh(baseMesh.geometry, baseMesh.material, this.entities.length);

    this.mesh = mesh;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.entities.length; i += 1) {
      const entity = this.entities[i];

      dummy.position.set(...entity.origin);
      dummy.rotation.set(0, THREE.Math.degToRad(-1 * entity.angle), 0);
      dummy.scale.set(entity.scale, entity.scale, entity.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.castShadow = true;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.position.set(0, boundingBox.min.y, 0);
    mesh.receiveShadow = true;

    this.group.add(mesh);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const mesh = this.mesh;

    if (!mesh) {
      return;
    }

    disposeObject3D(mesh, true);
  }
}
