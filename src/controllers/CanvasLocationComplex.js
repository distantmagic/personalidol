// @flow

import autoBind from "auto-bind";
import * as THREE from "three";

import FBXLoader from "../three/FBXLoader";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { ElementSize } from "../framework/interfaces/ElementSize";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.PerspectiveCamera;
  +geometry: THREE.Geometry;
  +light: THREE.PointLight;
  +material: THREE.Material;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;
  +threeLoadingManager: THREE.LoadingManager;
  clock: any;
  mixer: any;
  +texture: THREE.Texture;

  constructor(threeLoadingManager: THREE.LoadingManager) {
    autoBind(this);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(70, 10, 0.1, 1000);
    this.camera.position.y = 20;
    this.camera.position.z = 40;
    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.texture = new THREE.TextureLoader(threeLoadingManager).load(
      "/assets/texture-blood-marble-512.png"
    );
    this.threeLoadingManager = threeLoadingManager;
    this.material = new THREE.MeshPhongMaterial({
      map: this.texture
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);

    this.light = new THREE.PointLight();
    this.light.position.set(3, 3, 3);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    // const object = await props.assetLoader.load("/assets/mesh-lp-guy.fbx");
    const object = await new Promise((resolve, reject) => {
      const loader = new FBXLoader(this.threeLoadingManager);

      loader.load("/assets/mesh-lp-guy.fbx", resolve, null, reject);
    });

    this.mixer = new THREE.AnimationMixer(object);

    const action = this.mixer.clipAction(object.animations[4]);
    action.play();

    // // object.traverse( function ( child ) {
    // //   if ( child.isMesh ) {
    // //     child.castShadow = true;
    // //     child.receiveShadow = true;
    // //   }
    // } );
    object.position.set(0, 0, 0);
    object.scale.set(0.2, 0.2, 0.2);

    this.scene.add(object);
    this.scene.add(this.mesh);
    this.scene.add(this.light);
  }

  begin(): void {}

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.light);
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
    // this.texture.dispose();
  }

  draw(renderer: THREE.WebGLRenderer): void {
    // renderer.setPixelRatio(window.devicePixelRatio / 2);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(this.scene, this.camera);
  }

  end(renderer: THREE.WebGLRenderer): void {}

  resize(elementSize: ElementSize): void {
    this.camera.aspect = elementSize.getAspect();
    this.camera.updateProjectionMatrix();
  }

  update(): void {
    const delta = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(delta);
    }

    // console.log(delta);
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 6);
  }
}
