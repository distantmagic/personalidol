import * as OIMO from "oimo";
import * as THREE from "three";
import autoBind from "auto-bind";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
import type PhysicsShape from "src/framework/interfaces/PhysicsShape";
import type { default as IPhysicsWorld } from "src/framework/interfaces/PhysicsWorld";

function getShapeSize(physicsShape: PhysicsShape): THREE.Vector3 {
  const shapeSize = new THREE.Vector3();

  physicsShape.getBoundingBox().getSize(shapeSize);

  return shapeSize;
}

export default class PhysicsWorld implements IPhysicsWorld {
  readonly controllers: {
    [key: string]: PhysicsController,
  } = {};
  readonly dynamicBodies: OIMO.Body[] = [];
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly world: OIMO.World = new OIMO.World({
    gravity: [0, -9.8 * 1000, 0],
    iterations: 30,
  });
  private readonly _rotationArray: [number, number, number, number] = [0, 0, 0, 1];
  private readonly _rotationQuaternion: THREE.Quaternion = new THREE.Quaternion();

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.world.postLoop = this.postLoop;
  }

  addPhysicsController(controller: PhysicsController): void {
    const controllerInstanceId = controller.getInstanceId();
    const initialPosition = controller.getPosition();
    const isDynamic = !controller.isStatic();
    const shapeSize = getShapeSize(controller);

    this.controllers[controllerInstanceId] = controller;

    const body = this.world.add({
      move: isDynamic,
      name: controllerInstanceId,
      pos: [initialPosition.x, initialPosition.y, initialPosition.z],
      size: [shapeSize.x, shapeSize.y, shapeSize.z],
      type: "sphere",
      restitution: 0,
      // belongsTo: 1,
      // collidesWith: 0xffffffff,
    });

    controller.setPhysicsBody(body);

    if (isDynamic) {
      this.dynamicBodies.push(body);
    }
  }

  addPhysicsShape(shape: PhysicsShape): void {
    const shapeOrigin = shape.getPosition();
    const shapeSize = getShapeSize(shape);
    const bodyPosition: [number, number, number] = [
      shapeOrigin.x + shapeSize.x / 2,
      shapeOrigin.y + shapeSize.y / 2,
      shapeOrigin.z + shapeSize.z / 2
    ];

    this.world.add({
      move: false,
      name: shape.getInstanceId(),
      pos: bodyPosition,
      restitution: 0,
      size: [shapeSize.x, shapeSize.y, shapeSize.z],
      type: "box",
      // belongsTo: 1,
      // collidesWith: 0xffffffff,
    });
  }

  removePhysicsController(controller: PhysicsController): void {
  }

  removePhysicsShape(shape: PhysicsShape): void {
  }

  update(delta: number): void {
    this.world.step();
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  private postLoop(): void {
    for (let dynamicBody of this.dynamicBodies) {
      const controller: PhysicsController = this.controllers[dynamicBody.name];

      dynamicBody.quaternion.toArray(this._rotationArray);
      this._rotationQuaternion.set(this._rotationArray[0], this._rotationArray[1], this._rotationArray[2], this._rotationArray[3]);

      controller.setPosition(dynamicBody.position.x, dynamicBody.position.y, dynamicBody.position.z);
      controller.setRotation(this._rotationQuaternion);
    }
  }
}
