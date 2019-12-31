// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import { default as GLTFModelQuery } from "../Query/GLTFModel";
import { default as TextureQuery } from "../Query/Texture";

import type { Group, LoadingManager as THREELoadingManager, Material, Mesh, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QueryBus } from "../../interfaces/QueryBus";

type WorkerGLTFModel = {|
  +angle: number,
  +classname: "model_fbx",
  +model_name: string,
  +model_texture: string,
  +origin: [number, number, number],
  +scale: number,
|};

function getMesh(scene: Scene): Mesh<BufferGeometry, Material> {
  for (let child of scene.children) {
    if (child instanceof THREE.Mesh) {
      return child;
    }
  }

  throw new Error("Could not find mesh.");
}

export default class GLTFModel extends CanvasView {
  +animationOffset: number;
  +baseUrl: string;
  +entities: $ReadOnlyArray<WorkerGLTFModel>;
  +group: Group;
  +queryBus: QueryBus;
  +texture: string;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    canvasViewBag: CanvasViewBag,
    queryBus: QueryBus,
    group: Group,
    threeLoadingManager: THREELoadingManager,
    baseUrl: string,
    texture: string,
    animationOffset: number,
    entities: $ReadOnlyArray<WorkerGLTFModel>
  ) {
    super(canvasViewBag);

    this.animationOffset = animationOffset;
    this.baseUrl = baseUrl;
    this.entities = entities;
    this.group = group;
    this.queryBus = queryBus;
    this.texture = texture;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const modelQuery = new GLTFModelQuery(this.threeLoadingManager, this.baseUrl, `${this.baseUrl}model.glb`);
    const response = await this.queryBus.enqueue(cancelToken, modelQuery).whenExecuted();

    const textureQuery = new TextureQuery(new THREE.TextureLoader(this.threeLoadingManager), `${this.baseUrl}${this.texture}`);
    const texture = await this.queryBus.enqueue(cancelToken, textureQuery).whenExecuted();

    const baseMesh = getMesh(response.scene);
    const boundingBox = new THREE.Box3();

    boundingBox.setFromBufferAttribute(baseMesh.geometry.attributes.position);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });

    // important - clone geometry as it may be shared between views
    const mesh = new THREE.InstancedMesh(baseMesh.geometry.clone(), material, this.entities.length);

    mesh.frustumCulled = false;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.entities.length; i += 1) {
      const entity = this.entities[i];

      dummy.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);
      dummy.rotation.set(0, THREE.Math.degToRad(-1 * entity.angle), 0);
      dummy.scale.set(entity.scale, entity.scale, entity.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // adjust mesh position to compensate Trenchbroom offset
    mesh.position.set(8, -24, 8);

    mesh.instanceMatrix.needsUpdate = true;

    this.children.add(mesh);
    this.group.add(this.children);
  }
}
