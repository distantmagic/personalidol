import * as THREE from "three";

import CanvasView from "../CanvasView";
import { default as GLTFModelQuery } from "../Query/GLTFModel";
import { default as TextureQuery } from "../Query/Texture";

import { Group, LoadingManager as THREELoadingManager, Mesh, Scene, Vector3 } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { QuakeWorkerGLTFModel } from "../../types/QuakeWorkerGLTFModel";
import { QueryBus } from "../../interfaces/QueryBus";

function getMesh(scene: Scene): Mesh {
  for (let child of scene.children) {
    if (child instanceof THREE.Mesh) {
      return child;
    }
  }

  throw new Error("Could not find mesh.");
}

export default class GLTFModel extends CanvasView {
  readonly animationOffset: number;
  readonly baseUrl: string;
  readonly entities: ReadonlyArray<QuakeWorkerGLTFModel>;
  readonly group: Group;
  readonly queryBus: QueryBus;
  readonly texture: string;
  readonly threeLoadingManager: THREELoadingManager;

  constructor(
    canvasViewBag: CanvasViewBag,
    queryBus: QueryBus,
    group: Group,
    threeLoadingManager: THREELoadingManager,
    baseUrl: string,
    texture: string,
    animationOffset: number,
    entities: ReadonlyArray<QuakeWorkerGLTFModel>
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

    // @ts-ignore
    boundingBox.setFromBufferAttribute(baseMesh.geometry.attributes.position);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });

    // important - clone geometry as it may be shared between views
    const geometry = baseMesh.geometry.clone();
    const origins: Vector3[] = [];

    const mesh = new THREE.InstancedMesh(geometry, material, this.entities.length);

    mesh.matrixAutoUpdate = false;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.entities.length; i += 1) {
      const entity = this.entities[i];

      dummy.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);
      dummy.rotation.set(0, THREE.Math.degToRad(-1 * entity.angle), 0);
      dummy.scale.set(entity.scale, entity.scale, entity.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      origins.push(new THREE.Vector3().fromArray(entity.origin));
    }

    // manually set bounding sphere, otherwise there will be problems with
    // frustum culling
    geometry.boundingSphere = new THREE.Sphere().setFromPoints(origins);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // adjust mesh position to compensate Trenchbroom offset
    // model "brick" size is defined in .fgd file
    mesh.position.set(8, -24, 8);

    mesh.instanceMatrix.needsUpdate = true;
    mesh.updateMatrix();

    this.children.add(mesh);
    this.group.add(this.children);
  }
}
