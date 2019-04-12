// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "clamp";
import { Howl, Howler } from "howler";

import FBXLoader from "../three/FBXLoader";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ElementSize } from "../framework/interfaces/ElementSize";
import type { FPSAdaptive } from "../framework/interfaces/FPSAdaptive";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

const planeSide = 128;

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.OrthographicCamera;
  +clock: THREE.Clock;
  +debug: Debugger;
  +fpsAdaptive: FPSAdaptive;
  +geometry: THREE.Geometry;
  +light: THREE.SpotLight;
  +loadingManager: THREE.LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +material: THREE.Material;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;
  +sound: Howl;
  +texture: THREE.Texture;
  actions: {
    [string]: THREE.AnimationAction
  };
  keys: {
    [string]: boolean
  };
  guy: ?THREE.Object3D;
  mixer: ?THREE.AnimationMixer;

  constructor(
    loadingManager: THREE.LoadingManager,
    fpsAdaptive: FPSAdaptive,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    debug: Debugger
  ) {
    autoBind(this);

    this.debug = debug;
    this.fpsAdaptive = fpsAdaptive;
    this.loggerBreadcrumbs = loggerBreadcrumbs;

    this.clock = new THREE.Clock();
    this.sound = new Howl({
      distanceModel: "exponential",
      loop: true,
      rolloffFactor: 0.2,
      src: ["/assets/track-lithium.mp3"]
      // volume: 0.1,
    });

    this.actions = {};
    this.keys = {};

    this.scene = new THREE.Scene();

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
    this.loadingManager = loadingManager;
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

    // const guy = await props.assetLoader.load("/assets/mesh-lp-guy.fbx");
    const loader = new FBXLoader(this.loadingManager);

    loader.setResourcePath("/assets/mesh-default-character/");

    const defaultCharacter = await new Promise((resolve, reject) => {
      loader.load("/assets/mesh-default-character.fbx", resolve, null, reject);
    });
    // const attack = await new Promise((resolve, reject) => {
    //   loader.load("/assets/animation-attack-01.fbx", resolve, null, reject);
    // });
    const idle = await new Promise((resolve, reject) => {
      loader.load(
        "/assets/animation-idle-normal-01.fbx",
        resolve,
        null,
        reject
      );
    });

    const guy = new THREE.Group();

    const bones = defaultCharacter.children[0];

    guy.add(bones);

    const body = defaultCharacter.children[7];

    guy.add(body);

    const head = defaultCharacter.children[14];

    guy.add(head);

    this.guy = guy;

    const mixer = new THREE.AnimationMixer(guy);

    this.mixer = mixer;

    const action = mixer.clipAction(idle.animations[0]);
    action.play();

    // this.actions.idle = mixer.clipAction(guy.animations[2]);
    // this.actions.run = mixer.clipAction(guy.animations[8]);

    // this.actions.current = mixer.clipAction(guy.animations[2]);
    // this.actions.current.play();

    // // guy.traverse( function ( child ) {
    // //   if ( child.isMesh ) {
    // //     child.receiveShadow = true;
    // //   }
    // } );
    guy.position.set(0, 0, 0);
    guy.scale.set(0.1, 0.1, 0.1);

    this.scene.add(guy);
    this.scene.add(this.mesh);
    this.scene.add(this.light);

    // const geo = new THREE.EdgesGeometry( this.geometry ); // or WireframeGeometry( geometry )
    // const mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    // const wireframe = new THREE.LineSegments( geo, mat );

    // wireframe.position.y = 11;
    // wireframe.rotation.y = Math.PI / 3;
    // wireframe.scale.set(10, 10, 10);

    // this.scene.add( wireframe );
  }

  begin(): void {}

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    const guy = this.guy;

    // this.sound.stop();

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
    // renderer.setPixelRatio(window.devicePixelRatio / 2);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.render(this.scene, this.camera);
  }

  end(fps: number, isPanicked: boolean): void {
    this.fpsAdaptive.setActualFPS(fps);
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  onKeyDown(evt: KeyboardEvent) {
    this.keys[evt.key] = true;
  }

  onKeyUp(evt: KeyboardEvent) {
    this.keys[evt.key] = false;
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

  idle(): void {
    // this.actions.run.play();
    // this.actions.idle.play();
    // this.actions.current.crossFadeTo(this.actions.idle, 0.3);
  }

  run(): void {
    // this.actions.run.play();
    // this.actions.idle.play();
    // this.actions.current.crossFadeTo(this.actions.run, 0.3);
  }

  async start(): Promise<void> {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  async stop(): Promise<void> {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  update(delta: number): void {
    const mixer = this.mixer;

    if (mixer) {
      mixer.update(delta / 1000);
    }

    const guy = this.guy;
    // const stepSize = 0.4;
    const stepSize = 1;

    if (guy) {
      // guy.rotation.x = -1 * Math.PI / 2;
      // guy.rotation.x += 0.01;
      guy.rotation.x = 0;

      if (this.keys.ArrowLeft) {
        guy.position.x -= stepSize;
        guy.rotation.y = (-1 * Math.PI) / 2;
      }
      if (this.keys.ArrowRight) {
        guy.position.x += stepSize;
        guy.rotation.y = Math.PI / 2;
      }
      if (this.keys.ArrowUp) {
        guy.position.z -= stepSize;
        guy.rotation.y = Math.PI;
      }
      if (this.keys.ArrowUp && this.keys.ArrowLeft) {
        guy.rotation.y = -1 * Math.PI * 0.75;
      }
      if (this.keys.ArrowUp && this.keys.ArrowRight) {
        guy.rotation.y = Math.PI * 0.75;
      }
      if (this.keys.ArrowDown) {
        guy.position.z += stepSize;
        guy.rotation.y = 0;
      }
      if (this.keys.ArrowDown && this.keys.ArrowLeft) {
        guy.rotation.y = (-1 * Math.PI) / 4;
      }
      if (this.keys.ArrowDown && this.keys.ArrowRight) {
        guy.rotation.y = Math.PI / 4;
      }

      if (
        this.keys.ArrowDown ||
        this.keys.ArrowLeft ||
        this.keys.ArrowRight ||
        this.keys.ArrowUp
      ) {
        // console.log('key pressed');
        this.idle();
      } else {
        this.run();
      }

      guy.position.x = clamp(
        guy.position.x,
        -1 * (planeSide / 2),
        planeSide / 2
      );
      guy.position.z = clamp(
        guy.position.z,
        -1 * (planeSide / 2),
        planeSide / 2
      );

      Howler.pos(guy.position.x, guy.position.z, 0);

      this.camera.position.set(
        1 * guy.position.x + 16,
        20,
        1 * guy.position.z + 16
      );
    }

    // console.log(delta);
    // this.light.position.y += 0.1;

    // this.clock.getDelta();

    // this.mesh.position.x = Math.sin(this.clock.elapsedTime) * 32;
    // this.mesh.position.z = Math.cos(this.clock.elapsedTime) * 16;

    // this.sound.pos(this.mesh.position.x, this.mesh.position.z, 0);

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.05) % 32);
    // this.mesh.scale.y = ((this.mesh.scale.y + 0.05) % 32);
    // this.mesh.scale.z = ((this.mesh.scale.z + 0.05) % 32);
  }
}
