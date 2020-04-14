import * as OIMO from "oimo";
import * as THREE from "three";
import autoBind from "auto-bind";

import { default as PhysicsException } from "src/framework/classes/Exception/Physics";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
import type PhysicsShape from "src/framework/interfaces/PhysicsShape";
import type { default as IPhysicsWorld } from "src/framework/interfaces/PhysicsWorld";

function getShapeBoundingBoxSize(loggerBreadcrumbs: LoggerBreadcrumbs, physicsShape: PhysicsShape): THREE.Vector3 {
  const shapeSize = new THREE.Vector3();

  physicsShape.getBoundingBox().getSize(shapeSize);

  return shapeSize;
}

function getShapeBoundingSphereSize(loggerBreadcrumbs: LoggerBreadcrumbs, physicsShape: PhysicsShape): THREE.Vector3 {
  return new THREE.Vector3(physicsShape.getBoundingSphere().radius, 0, 0);
}

function getShapeSize(loggerBreadcrumbs: LoggerBreadcrumbs, shapeType: "box" | "cylinder" | "plane" | "sphere", physicsShape: PhysicsShape): THREE.Vector3 {
  switch (shapeType) {
    case "box":
    case "cylinder":
      return getShapeBoundingBoxSize(loggerBreadcrumbs, physicsShape);
    case "plane":
      throw new PhysicsException(loggerBreadcrumbs, "Plane shape is not yet implemented.");
    case "sphere":
      return getShapeBoundingSphereSize(loggerBreadcrumbs, physicsShape);
  }

  throw new PhysicsException(loggerBreadcrumbs, `Unknown shape: "${shapeType}"`);
}

export default class PhysicsWorld implements IPhysicsWorld {
  readonly controllers: {
    [key: string]: PhysicsController,
  } = {};
  readonly dynamicBodies: OIMO.Body[] = [];
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly oimo: OIMO.World = new OIMO.World({
    gravity: [0, -9.8 * 1000, 0],
    // iterations: 16,
  });

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.oimo.postLoop = this.postLoop;
  }

  addPhysicsController(controller: PhysicsController): OIMO.Body {
    const controllerInstanceId = controller.getInstanceId();
    const isDynamic = !controller.isStatic();

    this.controllers[controllerInstanceId] = controller;

    const body = this.addPhysicsShape(controller, isDynamic);

    controller.setPhysicsBody(body);

    if (isDynamic) {
      this.dynamicBodies.push(body);
    }

    return body;
  }

  addPhysicsShape(shape: PhysicsShape, isDynamic: boolean = false): OIMO.Body {
    const shapeOrigin = shape.getPosition();
    const shapeType = shape.getShapeType();
    const shapeSize = getShapeSize(this.loggerBreadcrumbs.add("getShapeSize"), shapeType, shape);
    const bodyPosition: [number, number, number] = [
      shapeOrigin.x + shapeSize.x / 2,
      shapeOrigin.y + shapeSize.y / 2,
      shapeOrigin.z + shapeSize.z / 2
    ];

    const body = this.oimo.add({
      // friction: 0.8,
      move: isDynamic,
      name: shape.getInstanceId(),
      pos: bodyPosition,
      restitution: 0,
      size: [shapeSize.x, shapeSize.y, shapeSize.z],
      type: shapeType,
      // belongsTo: 1,
      // collidesWith: 0xffffffff,
    });

    return body;
  }

  removePhysicsController(controller: PhysicsController): void {
  }

  removePhysicsShape(shape: PhysicsShape): void {
  }

  update(delta: number): void {
    this.oimo.step();
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  private postLoop(): void {
    for (let dynamicBody of this.dynamicBodies) {
      const controller: PhysicsController = this.controllers[dynamicBody.name];

      controller.updateFromPhysicsBody(dynamicBody);
    }
  }
}
