// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { Howl, Howler } from "howler";

import { default as EntityView } from "../views/Entity";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ElementSize } from "../framework/interfaces/ElementSize";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";

const planeSide = 128;

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.OrthographicCamera;
  +debug: Debugger;
  +entityView: EntityView;
  +geometry: THREE.Geometry;
  +keyboardState: KeyboardState;
  +light: THREE.SpotLight;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +material: THREE.Material;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;
  +sound: Howl;
  +texture: THREE.Texture;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager,
    keyboardState: KeyboardState,
    debug: Debugger
  ) {
    autoBind(this);

    this.debug = debug;
    this.keyboardState = keyboardState;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.threeLoadingManager = threeLoadingManager;

    this.scene = new THREE.Scene();
    this.entityView = new EntityView(
      exceptionHandler,
      loggerBreadcrumbs,
      threeLoadingManager,
      this.scene,
      keyboardState
    );

    const loadingManager = threeLoadingManager.getLoadingManager();

    this.sound = new Howl({
      distanceModel: "exponential",
      loop: true,
      rolloffFactor: 0.2,
      src: ["/assets/track-lithium.mp3"]
      // volume: 0.1,
    });

    // const geometry = new THREE.PlaneGeometry(32, 32, 1, 1);
    const geometry = new THREE.PlaneGeometry(planeSide, planeSide, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xcccccc
      // roughness: 1,
      // side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = (-1 * Math.PI) / 2;
    plane.rotation.y = 0;
    plane.rotation.z = Math.PI / 2;

    this.scene.add(plane);

    this.camera = new THREE.OrthographicCamera();
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(this.scene.position);
    // this.camera.position.y = 20;
    // this.camera.position.z = 40;

    this.geometry = new THREE.BoxGeometry(2, 2, 2);
    this.texture = new THREE.TextureLoader(loadingManager).load(
      "/assets/texture-blood-marble-512.png"
    );
    this.material = new THREE.MeshPhongMaterial({
      map: this.texture
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 2, 0);

    // this.light = new THREE.HemisphereLight(0xffffbb, 0x080820);
    this.light = new THREE.SpotLight(0xffffff);
    // this.light.position.set(planeSide / 2, planeSide / 2, planeSide / 2);
    this.light.position.set(planeSide, planeSide, planeSide);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    // this.sound.pos(0, 0, 0);
    // this.sound.play();

    // this.scene.add(guy);
    this.scene.add(this.mesh);
    this.scene.add(this.light);

    // const geo = new THREE.EdgesGeometry( this.geometry ); // or WireframeGeometry( geometry )
    // const mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    // const wireframe = new THREE.LineSegments( geo, mat );

    // wireframe.position.y = 11;
    // wireframe.rotation.y = Math.PI / 3;
    // wireframe.scale.set(10, 10, 10);

    // this.scene.add( wireframe );

    await this.entityView.attach(renderer);
  }

  begin(): void {}

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.light);
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();

    await this.entityView.detach(renderer);
  }

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {
    // renderer.setPixelRatio(window.devicePixelRatio / 2);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.render(this.scene, this.camera);
  }

  end(fps: number, isPanicked: boolean): void {
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  resize(elementSize: ElementSize): void {
    const zoom = 20;
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.camera.left = (-1 * width) / zoom;
    this.camera.far = 195;
    this.camera.near = -125;
    this.camera.right = width / zoom;
    this.camera.top = height / zoom;
    this.camera.bottom = (-1 * height) / zoom;
    this.camera.updateProjectionMatrix();
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {
    this.mesh.position.z = 10;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    // Howler.pos(guy.position.x, guy.position.z, 0);

    // this.camera.position.set(
    //   1 * guy.position.x + 16,
    //   20,
    //   1 * guy.position.z + 16
    // );

    this.entityView.update(delta);
  }
}
