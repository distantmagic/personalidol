import * as OIMO from "oimo";
import autoBind from "auto-bind";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
import type PhysicsShape from "src/framework/interfaces/PhysicsShape";
import type { default as IPhysicsWorld } from "src/framework/interfaces/PhysicsWorld";

export default class PhysicsWorld implements IPhysicsWorld {
  readonly controllers: {
    [key: string]: PhysicsController,
  } = {};
  readonly dynamicBodies: OIMO.Body[] = [];
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly world: OIMO.World = new OIMO.World({
    iterations: 8,
    // 1 brute force, 2 sweep and prune, 3 volume tree
    broadphase: 2,
    // scale full world
    worldscale: 1,
    // randomize sample
    random: true,
    // calculate statistic or not
    info: false,
    gravity: [0, -9.8, 0],
    // gravity: [0, -9.8 * 200, 0],
    // gravity: [0, 0, 0],
  });

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.world.postLoop = this.postLoop;
  }

  addPhysicsController(controller: PhysicsController): void {
    const controllerInstanceId = controller.getInstanceId();
    const initialPosition = controller.getPosition();
    const isDynamic = !controller.isStatic();

    this.controllers[controllerInstanceId] = controller;

    const body = this.world.add({
      // type of shape : sphere, box, cylinder
      type: "box",
      // size of shape
      size: [32, 64, 32],
      // start position
      pos: [initialPosition.x, initialPosition.y, initialPosition.z],
      // start rotation in degree
      rot: [0, 0, 0],
      // dynamic or statique
      move: isDynamic,
      name: controllerInstanceId,
      density: 1,
      // friction: 0.2,
      // restitution: 0.2,
      // The bits of the collision groups to which the shape belongs.
      // belongsTo: 1,
      // The bits of the collision groups with which the shape collides.
      // collidesWith: 0xffffffff,
    });

    controller.setPhysicsBody(body);

    if (isDynamic) {
      this.dynamicBodies.push(body);
    }
  }

  addPhysicsShape(shape: PhysicsShape): void {
    const shapeOrigin = shape.getOrigin();
    const shapeSize = shape.getSize();

    // console.log({
    //   origin: [shapeOrigin.getX(), shapeOrigin.getY(), shapeOrigin.getZ()],
    //   size: [shapeSize.getWidth(), shapeSize.getHeight(), shapeSize.getDepth()],
    // });

    this.world.add({
      type: "box",
      size: [shapeSize.getWidth(), shapeSize.getHeight(), shapeSize.getDepth()],
      pos: [
        shapeOrigin.getX() + shapeSize.getWidth() / 2,
        shapeOrigin.getY() + shapeSize.getHeight() / 2,
        shapeOrigin.getZ() + shapeSize.getDepth() / 2
      ],
      rot: [0, 0, 0],
      move: false,
      // name: controllerInstanceId,
      density: 1,
      // friction: 0.2,
      // restitution: 0.2,
      // belongsTo: 1,
      // collidesWith: 0xffffffff,
    });
  }

  removePhysicsController(controller: PhysicsController): void {
  }

  removePhysicsShape(shape: PhysicsShape): void {
  }

  update(delta: number): void {
    this.world.timerate = delta * 1000;
    this.world.timeStep = delta;
    this.world.step();
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  private postLoop(): void {
    for (let dynamicBody of this.dynamicBodies) {
      const controller: PhysicsController = this.controllers[dynamicBody.name];

      controller.setPosition(dynamicBody.position.x, dynamicBody.position.y, dynamicBody.position.z);
    }
  }
}
