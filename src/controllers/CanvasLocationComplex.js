// @flow

import autoBind from "auto-bind";
import * as THREE from "three";
import FBXLoader from "../three/FBXLoader";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { ClockTick } from "../framework/interfaces/ClockTick";
import type { ElementSize } from "../framework/interfaces/ElementSize";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.PerspectiveCamera;
  +geometry: THREE.Geometry;
  +light: THREE.PointLight;
  +material: THREE.Material;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;
  // +texture: THREE.Texture;

  constructor() {
    autoBind(this);

    console.log(FBXLoader);

    this.camera = new THREE.PerspectiveCamera(70, 10, 0.1, 1000);
    this.camera.position.y = 20;
    this.camera.position.z = 40;
    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    // this.texture = new THREE.TextureLoader().load(
    //   "/assets/texture-navy-blue-marble-512.jpg"
    // );
    this.material = new THREE.MeshPhongMaterial({
      // map: this.texture
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);

    this.light = new THREE.PointLight();
    this.light.position.set(3, 3, 3);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    const loader = new FBXLoader();

    loader.load(
      "/assets/mesh-lp-guy.fbx",
      object => {
        console.log("onLoad", object);
        // mixer = new THREE.AnimationMixer( object );
        // var action = mixer.clipAction( object.animations[ 0 ] );
        // action.play();
        // // object.traverse( function ( child ) {
        // //   if ( child.isMesh ) {
        // //     child.castShadow = true;
        // //     child.receiveShadow = true;
        // //   }
        // } );
        object.position.set(0, 0, 0);
        object.scale.set(0.2, 0.2, 0.2);
        this.scene.add(object);
      },
      function(progress) {
        console.log(progress);
      },
      function(error) {
        console.log(error);
      }
    );

    this.scene.add(this.mesh);
    this.scene.add(this.light);
  }

  begin(tick: ClockTick): void {}

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.light);
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
    // this.texture.dispose();
  }

  draw(renderer: THREE.WebGLRenderer, tick: ClockTick): void {
    renderer.setPixelRatio(window.devicePixelRatio / 1);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(this.scene, this.camera);
  }

  end(renderer: THREE.WebGLRenderer, tick: ClockTick): void {}

  resize(elementSize: ElementSize): void {
    this.camera.aspect = elementSize.getAspect();
    this.camera.updateProjectionMatrix();
  }

  update(tick: ClockTick): void {
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 6);
  }
}
