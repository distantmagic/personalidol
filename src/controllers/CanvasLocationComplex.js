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
  +texture: THREE.Texture;
  +threeLoadingManager: THREE.LoadingManager;
  keys: {
    [string]: boolean,
  };
  guy: ?THREE.Object3D;
  mixer: ?THREE.AnimationMixer;

  constructor(threeLoadingManager: THREE.LoadingManager) {
    autoBind(this);

    this.keys = {};

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
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);

    // const guy = await props.assetLoader.load("/assets/mesh-lp-guy.fbx");
    const guy = await new Promise((resolve, reject) => {
      const loader = new FBXLoader(this.threeLoadingManager);

      loader.load("/assets/mesh-lp-guy.fbx", resolve, null, reject);
    });

    this.guy = guy;
    this.mixer = new THREE.AnimationMixer(guy);

    const action = this.mixer.clipAction(guy.animations[8]);
    action.play();

    // // guy.traverse( function ( child ) {
    // //   if ( child.isMesh ) {
    // //     child.castShadow = true;
    // //     child.receiveShadow = true;
    // //   }
    // } );
    guy.position.set(0, 0, 0);
    guy.scale.set(0.05, 0.05, 0.05);

    this.scene.add(guy);
    this.scene.add(this.mesh);
    this.scene.add(this.light);
  }

  begin(): void {
  }

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);

    const guy = this.guy;

    if (guy) {
      this.scene.remove(guy);
    }

    this.scene.remove(this.light);
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(this.scene, this.camera);
  }

  end(fps: number, isPanicked: boolean): void {}

  onKeyDown(evt: KeyboardEvent) {
    this.keys[evt.key] = true;
  }

  onKeyUp(evt: KeyboardEvent) {
    this.keys[evt.key] = false;
  }

  resize(elementSize: ElementSize): void {
    this.camera.aspect = elementSize.getAspect();
    this.camera.updateProjectionMatrix();
  }

  update(delta: number): void {
    const mixer = this.mixer;

    if (mixer) {
      mixer.update(delta / 1000);
    }

    const guy = this.guy;

    if (guy) {

      if (this.keys.ArrowLeft) {
        guy.position.x -= 1;
        guy.rotation.y = -1 * Math.PI / 2;
      }
      if (this.keys.ArrowRight) {
        guy.position.x += 1;
        guy.rotation.y = Math.PI / 2;
      }
      if (this.keys.ArrowUp) {
        guy.position.z -= 1;
        guy.rotation.y = Math.PI;
      }
      if (this.keys.ArrowUp && this.keys.ArrowLeft) {
        guy.rotation.y = -1 * Math.PI * 0.75;
      }
      if (this.keys.ArrowUp && this.keys.ArrowRight) {
        guy.rotation.y = Math.PI * 0.75;
      }
      if (this.keys.ArrowDown) {
        guy.position.z += 1;
        guy.rotation.y = 0;
      }
      if (this.keys.ArrowDown && this.keys.ArrowLeft) {
        guy.rotation.y = -1 * Math.PI / 4;
      }
      if (this.keys.ArrowDown && this.keys.ArrowRight) {
        guy.rotation.y = Math.PI / 4;
      }
    }

    // console.log(delta);
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 6);
  }
}
