// @flow

/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from "three";
import { MD2Loader } from "three/examples/jsm/loaders/MD2Loader";
import { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh";

import disposeObject3D from "../helpers/disposeObject3D";
import disposeTexture from "../helpers/disposeTexture";

import type { BufferGeometry, LoadingManager } from "three";

import type { MD2Character as MD2CharacterInterface } from "../interfaces/MD2Character";
import type { MD2CharacterMesh } from "../types/MD2CharacterMesh";

// internal helpers

function loadTextures(scope: MD2CharacterInterface, baseUrl: string, loadingManager: LoadingManager, textureUrls: $ReadOnlyArray<string>): Texture[] {
  var textureLoader = new THREE.TextureLoader(loadingManager);
  var textures = [];

  for (let i = 0; i < textureUrls.length; i++) {
    textures[i] = textureLoader.load(baseUrl + textureUrls[i], checkLoadingComplete.bind(null, scope));
    textures[i].mapping = THREE.UVMapping;
    textures[i].name = textureUrls[i];
  }

  return textures;
}

function createPart(scope: MD2CharacterInterface, geometry: BufferGeometry, skinMap: Texture): MD2CharacterMesh {
  // var materialWireframe = new THREE.MeshLambertMaterial({ color: 0xffaa00, wireframe: true, morphTargets: true, morphNormals: true });
  var materialTexture = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, map: skinMap, morphTargets: true, morphNormals: true });

  //

  var mesh = new MorphBlendMesh(geometry, materialTexture);
  mesh.rotation.y = -Math.PI / 2;

  //

  mesh.materialTexture = materialTexture;
  // mesh.materialWireframe = materialWireframe;

  //

  mesh.autoCreateAnimations(scope.animationFPS);

  return mesh;
}

function checkLoadingComplete(scope: MD2CharacterInterface): void {
  scope.loadCounter -= 1;
  if (scope.loadCounter === 0) scope.onLoadComplete();
}

function exponentialEaseOut(k): number {
  return k === 1 ? 1 : -Math.pow(2, -10 * k) + 1;
}

export default class MD2Character implements MD2CharacterInterface {
  +loadingManager: LoadingManager;

  scale = 1;

  // animation parameters

  animationFPS = 6;
  transitionFrames = 15;

  // movement model parameters

  crouchSpeed: number;
  walkSpeed: number;

  maxSpeed = 275;
  maxReverseSpeed = -275;

  frontAcceleration = 600;
  backAcceleration = 600;

  frontDecceleration = 600;

  angularSpeed = 2.5;

  // rig

  root = new THREE.Object3D();

  meshBody: ?MD2CharacterMesh = null;
  meshWeapon: ?MD2CharacterMesh = null;

  controls = null;

  // skins

  skinsBody = [];
  skinsWeapon = [];

  weapons = [];

  currentSkin = undefined;

  //

  onLoadComplete = function() {};

  // internals

  meshes = [];
  animations = {};

  loadCounter = 0;

  // internal movement control variables

  speed = 0;

  // internal animation parameters

  activeAnimation = null;
  oldAnimation = null;

  // wtf

  blendCounter = 0;

  constructor(loadingManager: LoadingManager) {
    this.loadingManager = loadingManager;
    this.walkSpeed = this.maxSpeed;
    this.crouchSpeed = this.maxSpeed * 0.5;
  }

  // API

  enableShadows(enable: boolean) {
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].castShadow = enable;
      this.meshes[i].receiveShadow = enable;
    }
  }

  setVisible(enable: boolean) {
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].visible = enable;
      this.meshes[i].visible = enable;
    }
  }

  shareParts(original: MD2CharacterInterface) {
    const originalMeshBody = original.meshBody;

    if (!originalMeshBody) {
      throw new Error("originalMeshBody is not set but it was expected.");
    }

    this.animations = original.animations;

    // this.walkSpeed = original.walkSpeed;
    // this.crouchSpeed = original.crouchSpeed;

    this.skinsBody = original.skinsBody;
    this.skinsWeapon = original.skinsWeapon;

    // BODY

    var mesh = createPart(this, originalMeshBody.geometry, this.skinsBody[0]);
    mesh.scale.set(this.scale, this.scale, this.scale);

    this.root.position.y = original.root.position.y;
    this.root.add(mesh);

    this.meshBody = mesh;

    this.meshes.push(mesh);

    // WEAPONS

    for (let i = 0; i < original.weapons.length; i++) {
      var meshWeapon = createPart(this, original.weapons[i].geometry, this.skinsWeapon[i]);
      meshWeapon.scale.set(this.scale, this.scale, this.scale);
      meshWeapon.visible = false;

      meshWeapon.name = original.weapons[i].name;

      this.root.add(meshWeapon);

      this.weapons[i] = meshWeapon;
      this.meshWeapon = meshWeapon;

      this.meshes.push(meshWeapon);
    }
  }

  loadParts(config: Object) {
    const scope = this;

    this.animations = config.animations;
    this.walkSpeed = config.walkSpeed;
    this.crouchSpeed = config.crouchSpeed;

    this.loadCounter = config.weapons.length * 2 + config.skins.length + 1;

    var weaponsTextures = [];
    for (let i = 0; i < config.weapons.length; i++) weaponsTextures[i] = config.weapons[i][1];

    // SKINS

    this.skinsBody = loadTextures(this, config.baseUrl + "skins/", this.loadingManager, config.skins);
    this.skinsWeapon = loadTextures(this, config.baseUrl + "skins/", this.loadingManager, weaponsTextures);

    // BODY

    var loader = new MD2Loader(this.loadingManager);

    loader.load(config.baseUrl + config.body, function(geo) {
      var boundingBox = new THREE.Box3();
      boundingBox.setFromBufferAttribute(geo.attributes.position);

      scope.root.position.y = -scope.scale * boundingBox.min.y;

      var mesh = createPart(scope, geo, scope.skinsBody[0]);
      mesh.scale.set(scope.scale, scope.scale, scope.scale);

      scope.root.add(mesh);

      scope.meshBody = mesh;
      scope.meshes.push(mesh);

      checkLoadingComplete(scope);
    });

    // WEAPONS

    config.weapons.forEach(function([name, texture], index) {
      loader.load(config.baseUrl + name, function(geo) {
        var mesh = createPart(scope, geo, scope.skinsWeapon[index]);
        mesh.scale.set(scope.scale, scope.scale, scope.scale);
        mesh.visible = false;

        mesh.name = name;

        scope.root.add(mesh);

        scope.weapons[index] = mesh;
        scope.meshWeapon = mesh;
        scope.meshes.push(mesh);

        checkLoadingComplete(scope);
      });
    });
  }

  setSkin(index: number) {
    if (this.meshBody && this.meshBody.material.wireframe === false) {
      this.meshBody.material.map = this.skinsBody[index];
      this.currentSkin = index;
    }
  }

  setWeapon(index: number) {
    const meshBody = this.meshBody;
    const meshWeapon = this.meshWeapon;

    if (!meshBody) {
      throw new Error("meshBody is not loaded yet.");
    }

    if (!meshWeapon) {
      throw new Error("meshWeapon is not loaded yet.");
    }

    for (let i = 0; i < this.weapons.length; i++) this.weapons[i].visible = false;

    var activeWeapon = this.weapons[index];

    if (activeWeapon) {
      activeWeapon.visible = true;
      this.meshWeapon = activeWeapon;

      if (this.activeAnimation) {
        activeWeapon.playAnimation(this.activeAnimation);
        activeWeapon.setAnimationTime(this.activeAnimation, meshBody.getAnimationTime(this.activeAnimation));
      }
    }
  }

  setAnimation(animationName: string) {
    const meshBody = this.meshBody;
    const meshWeapon = this.meshWeapon;

    if (animationName === this.activeAnimation || !animationName) return;

    if (meshBody) {
      meshBody.setAnimationWeight(animationName, 0);
      meshBody.playAnimation(animationName);

      this.oldAnimation = this.activeAnimation;
      this.activeAnimation = animationName;

      this.blendCounter = this.transitionFrames;
    }

    if (meshWeapon) {
      meshWeapon.setAnimationWeight(animationName, 0);
      meshWeapon.playAnimation(animationName);
    }
  }

  update(delta: number) {
    const controls = this.controls;

    if (controls) this.updateMovementModel(controls, delta);

    if (this.animations) {
      this.updateBehaviors(controls);
      this.updateAnimations(delta);
    }
  }

  updateAnimations(delta: number) {
    var mix = 1;

    if (this.blendCounter > 0) {
      mix = (this.transitionFrames - this.blendCounter) / this.transitionFrames;
      this.blendCounter -= 1;
    }

    const meshBody = this.meshBody;

    if (meshBody) {
      meshBody.update(delta);

      meshBody.setAnimationWeight(this.activeAnimation, mix);
      meshBody.setAnimationWeight(this.oldAnimation, 1 - mix);
    }

    const meshWeapon = this.meshWeapon;

    if (meshWeapon) {
      meshWeapon.update(delta);

      meshWeapon.setAnimationWeight(this.activeAnimation, mix);
      meshWeapon.setAnimationWeight(this.oldAnimation, 1 - mix);
    }
  }

  updateBehaviors(controls: Object) {
    var animations = this.animations;

    var moveAnimation, idleAnimation;

    const meshBody = this.meshBody;
    const meshWeapon = this.meshWeapon;

    // crouch vs stand

    if (controls.crouch) {
      moveAnimation = animations["crouchMove"];
      idleAnimation = animations["crouchIdle"];
    } else {
      moveAnimation = animations["move"];
      idleAnimation = animations["idle"];
    }

    // actions

    if (controls.jump) {
      moveAnimation = animations["jump"];
      idleAnimation = animations["jump"];
    }

    if (controls.attack) {
      if (controls.crouch) {
        moveAnimation = animations["crouchAttack"];
        idleAnimation = animations["crouchAttack"];
      } else {
        moveAnimation = animations["attack"];
        idleAnimation = animations["attack"];
      }
    }

    // set animations

    if (controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight) {
      if (this.activeAnimation !== moveAnimation) {
        this.setAnimation(moveAnimation);
      }
    }

    if (Math.abs(this.speed) < 0.2 * this.maxSpeed && !(controls.moveLeft || controls.moveRight || controls.moveForward || controls.moveBackward)) {
      if (this.activeAnimation !== idleAnimation) {
        this.setAnimation(idleAnimation);
      }
    }

    // set animation direction

    if (controls.moveForward) {
      if (meshBody) {
        meshBody.setAnimationDirectionForward(this.activeAnimation);
        meshBody.setAnimationDirectionForward(this.oldAnimation);
      }

      if (meshWeapon) {
        meshWeapon.setAnimationDirectionForward(this.activeAnimation);
        meshWeapon.setAnimationDirectionForward(this.oldAnimation);
      }
    }

    if (controls.moveBackward) {
      if (meshBody) {
        meshBody.setAnimationDirectionBackward(this.activeAnimation);
        meshBody.setAnimationDirectionBackward(this.oldAnimation);
      }

      if (meshWeapon) {
        meshWeapon.setAnimationDirectionBackward(this.activeAnimation);
        meshWeapon.setAnimationDirectionBackward(this.oldAnimation);
      }
    }
  }

  updateMovementModel(controls: Object, delta: number) {
    // speed based on controls

    if (controls.crouch) this.maxSpeed = this.crouchSpeed;
    else this.maxSpeed = this.walkSpeed;

    this.maxReverseSpeed = -this.maxSpeed;

    if (controls.moveForward) this.speed = THREE.Math.clamp(this.speed + delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed);
    if (controls.moveBackward) this.speed = THREE.Math.clamp(this.speed - delta * this.backAcceleration, this.maxReverseSpeed, this.maxSpeed);

    // orientation based on controls
    // (don't just stand while turning)

    var dir = 1;

    if (controls.moveLeft) {
      this.speed = THREE.Math.clamp(this.speed + dir * delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed);
    }

    if (controls.moveRight) {
      this.speed = THREE.Math.clamp(this.speed + dir * delta * this.frontAcceleration, this.maxReverseSpeed, this.maxSpeed);
    }

    // speed decay

    if (!(controls.moveForward || controls.moveBackward)) {
      if (this.speed > 0) {
        let k = exponentialEaseOut(this.speed / this.maxSpeed);
        this.speed = THREE.Math.clamp(this.speed - k * delta * this.frontDecceleration, 0, this.maxSpeed);
      } else {
        let k = exponentialEaseOut(this.speed / this.maxReverseSpeed);
        this.speed = THREE.Math.clamp(this.speed + k * delta * this.backAcceleration, this.maxReverseSpeed, 0);
      }
    }
  }

  dispose(): void {
    this.skinsBody.forEach(disposeTexture);
    this.skinsWeapon.forEach(disposeTexture);
    this.weapons.forEach(function(child) {
      disposeObject3D(child, true);
    });

    const meshBody = this.meshBody;

    if (meshBody) {
      disposeObject3D(meshBody, true);
    }

    const meshWeapon = this.meshWeapon;

    if (meshWeapon) {
      disposeObject3D(meshWeapon, true);
    }

    disposeObject3D(this.root, true);
  }
}
