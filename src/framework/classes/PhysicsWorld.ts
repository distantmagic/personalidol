import * as OIMO from "oimo";
import autoBind from "auto-bind";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
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
    gravity: [0, -988.8, 0],
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

    this.world.add({
      size:[2000, 50, 2000],
      pos:[0,0,0]
    });

    const body = this.world.add({
      // type of shape : sphere, box, cylinder
      type: "box",
      // size of shape
      size: [1, 1, 1],
      // start position
      pos: [initialPosition.x, initialPosition.y + 320, initialPosition.z],
      // start rotation in degree
      rot: [0, 0, 0],
      // dynamic or statique
      move: isDynamic,
      name: controllerInstanceId,
      density: 1,
      friction: 0.2,
      restitution: 0.2,
      // The bits of the collision groups to which the shape belongs.
      belongsTo: 1,
      // The bits of the collision groups with which the shape collides.
      collidesWith: 0xffffffff,
    });

    controller.setPhysicsBody(body);

    if (isDynamic) {
      this.dynamicBodies.push(body);
    }
  }

  removePhysicsController(controller: PhysicsController): void {
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
