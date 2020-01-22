/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from "three";
import { MD2Loader } from "three/examples/jsm/loaders/MD2Loader";
import { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh";

import dispose from "src/framework/helpers/dispose";

import { default as LoaderException } from "src/framework/classes/Exception/Loader";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IMD2Character } from "src/framework/interfaces/MD2Character";

import MD2CharacterAnimations from "src/framework/types/MD2CharacterAnimations";
import MD2CharacterConfig from "src/framework/types/MD2CharacterConfig";
import MD2CharacterControls from "src/framework/types/MD2CharacterControls";

function checkLoadingComplete(scope: IMD2Character): void {
  scope.loadCounter -= 1;
  if (scope.loadCounter === 0) scope.onLoadComplete();
}

function createPart(scope: IMD2Character, geometry: THREE.BufferGeometry | THREE.Geometry, skinMap: THREE.Texture): MorphBlendMesh {
  const materialTexture = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: false,
    map: skinMap,
    morphTargets: true,
    morphNormals: true,
  });
  const mesh = new MorphBlendMesh(geometry, materialTexture);

  mesh.rotation.y = -Math.PI / 2;
  // mesh.materialTexture = materialTexture;

  mesh.autoCreateAnimations(scope.animationFPS);

  return mesh;
}

function loadTextures(scope: IMD2Character, baseUrl: string, loadingManager: THREE.LoadingManager, textureUrls: ReadonlyArray<string>): THREE.Texture[] {
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const textures = [];

  for (let i = 0; i < textureUrls.length; i++) {
    textures[i] = textureLoader.load(baseUrl + textureUrls[i], checkLoadingComplete.bind(null, scope));
    textures[i].mapping = THREE.UVMapping;
    textures[i].name = textureUrls[i];
  }

  return textures;
}

export default class MD2Character implements HasLoggerBreadcrumbs, IMD2Character {
  readonly loadingManager: THREE.LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  // animation parameters

  animationFPS = 6;
  transitionFrames = 15;

  // rig

  root = new THREE.Object3D();

  meshBody: null | MorphBlendMesh = null;
  meshWeapon: null | MorphBlendMesh = null;

  controls: null | MD2CharacterControls = null;

  // skins

  skinsBody: THREE.Texture[] = [];
  skinsWeapon: THREE.Texture[] = [];

  weapons: MorphBlendMesh[] = [];

  currentSkin: number = 0;

  //

  onLoadComplete = function() {};

  // internals

  meshes: MorphBlendMesh[] = [];
  animations: null | MD2CharacterAnimations = null;

  loadCounter = 0;

  // internal animation parameters

  activeAnimation: string = "";
  oldAnimation: string = "";

  blendCounter = 0;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, loadingManager: THREE.LoadingManager) {
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
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

  shareParts(original: IMD2Character) {
    const originalMeshBody = original.meshBody;

    if (!originalMeshBody) {
      throw new LoaderException(this.loggerBreadcrumbs.add("shareParts"), "originalMeshBody is not set but it was expected.");
    }

    this.animations = original.animations;

    this.skinsBody = original.skinsBody;
    this.skinsWeapon = original.skinsWeapon;

    // BODY

    const mesh = createPart(this, originalMeshBody.geometry, this.skinsBody[0]);

    this.root.position.y = original.root.position.y;
    this.root.add(mesh);

    this.meshBody = mesh;

    this.meshes.push(mesh);

    // WEAPONS

    for (let i = 0; i < original.weapons.length; i++) {
      const meshWeapon = createPart(this, original.weapons[i].geometry, this.skinsWeapon[i]);
      meshWeapon.visible = false;
      meshWeapon.name = original.weapons[i].name;

      this.root.add(meshWeapon);

      this.weapons[i] = meshWeapon;
      this.meshWeapon = meshWeapon;

      this.meshes.push(meshWeapon);
    }
  }

  loadParts(config: MD2CharacterConfig) {
    const scope = this;

    this.animations = config.animations;

    this.loadCounter = config.weapons.length * 2 + config.skins.length + 1;

    const weaponsTextures = [];
    for (let i = 0; i < config.weapons.length; i++) weaponsTextures[i] = config.weapons[i][1];

    // SKINS

    this.skinsBody = loadTextures(this, config.baseUrl + "skins/", this.loadingManager, config.skins);
    this.skinsWeapon = loadTextures(this, config.baseUrl + "skins/", this.loadingManager, weaponsTextures);

    // BODY

    const loader = new MD2Loader(this.loadingManager);

    loader.load(config.baseUrl + config.body, function(geo) {
      const boundingBox = new THREE.Box3();

      // @ts-ignore
      boundingBox.setFromBufferAttribute(geo.attributes.position);

      const mesh = createPart(scope, geo, scope.skinsBody[0]);

      scope.root.add(mesh);

      scope.meshBody = mesh;
      scope.meshes.push(mesh);

      checkLoadingComplete(scope);
    });

    // WEAPONS

    config.weapons.forEach(function([name, texture], index) {
      loader.load(config.baseUrl + name, function(geo) {
        const mesh = createPart(scope, geo, scope.skinsWeapon[index]);
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
    const meshBody = this.meshBody;

    if (!meshBody) {
      throw new LoaderException(this.loggerBreadcrumbs.add("setSkin"), "Mesh body is not defined but it was expected.");
    }

    const material = meshBody.material;

    if (!material) {
      throw new LoaderException(this.loggerBreadcrumbs.add("setSkin"), "Mesh body material is not defined.");
    }

    if (Array.isArray(material)) {
      throw new LoaderException(this.loggerBreadcrumbs.add("setSkin"), "Unexpected multi-material mesh in MD2 character.");
    }

    // @ts-ignore
    material.map = this.skinsBody[index];

    this.currentSkin = index;
  }

  setWeapon(index: number) {
    const meshBody = this.meshBody;
    const meshWeapon = this.meshWeapon;

    if (!meshBody) {
      throw new LoaderException(this.loggerBreadcrumbs.add("setWeapon"), "meshBody is not loaded yet.");
    }

    if (!meshWeapon) {
      throw new LoaderException(this.loggerBreadcrumbs.add("setWeapon"), "meshWeapon is not loaded yet.");
    }

    for (let i = 0; i < this.weapons.length; i++) {
      this.weapons[i].visible = false;
    }

    const activeWeapon = this.weapons[index];

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

    if (controls) {
      this.updateBehaviors(controls);
    }

    this.updateAnimations(delta);
  }

  updateAnimations(delta: number) {
    let mix = 1;

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

  updateBehaviors(controls: MD2CharacterControls) {
    const animations = this.animations;

    if (!animations) {
      throw new LoaderException(this.loggerBreadcrumbs.add("updateBehaviors"), "Animations are not defined.");
    }

    let moveAnimation, idleAnimation;

    const meshBody = this.meshBody;
    const meshWeapon = this.meshWeapon;

    // crouch vs stand

    if (controls.crouch) {
      moveAnimation = animations.crouchMove;
      idleAnimation = animations.crouchIdle;
    } else {
      moveAnimation = animations.move;
      idleAnimation = animations.idle;
    }

    // actions

    if (controls.jump) {
      moveAnimation = animations.jump;
      idleAnimation = animations.jump;
    }

    if (controls.attack) {
      if (controls.crouch) {
        moveAnimation = animations.crouchAttack;
        idleAnimation = animations.crouchAttack;
      } else {
        moveAnimation = animations.attack;
        idleAnimation = animations.attack;
      }
    }

    // set animations

    if (controls.moveForward || controls.moveBackward || controls.moveLeft || controls.moveRight) {
      if (this.activeAnimation !== moveAnimation) {
        this.setAnimation(moveAnimation);
      }
    }

    // if (Math.abs(this.speed) < 0.2 * this.maxSpeed && !(controls.moveLeft || controls.moveRight || controls.moveForward || controls.moveBackward)) {
    //   if (this.activeAnimation !== idleAnimation) {
    //     this.setAnimation(idleAnimation);
    //   }
    // }
    if (!controls.moveLeft || !controls.moveRight || !controls.moveForward || !controls.moveBackward) {
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

  dispose(): void {
    const disposeBound = dispose.bind(null, this.loggerBreadcrumbs.add("dispose"));

    this.skinsBody.forEach(disposeBound);
    this.skinsWeapon.forEach(disposeBound);
    this.weapons.forEach(disposeBound);

    const meshBody = this.meshBody;

    if (meshBody) {
      disposeBound(meshBody);
    }

    const meshWeapon = this.meshWeapon;

    if (meshWeapon) {
      disposeBound(meshWeapon);
    }

    this.meshes.forEach(disposeBound);
    disposeBound(this.root);
  }
}
