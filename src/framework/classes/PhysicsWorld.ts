import * as OIMO from "oimo";
import autoBind from "auto-bind";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
import type { default as IPhysicsWorld } from "src/framework/interfaces/PhysicsWorld";

export default class PhysicsWorld implements IPhysicsWorld {
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
  });

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    autoBind(this);

    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.world.postLoop = this.postLoop;
  }

  addPhysicsController(handler: PhysicsController): void {
    // console.log(handler.getInstanceId());
  }

  removePhysicsController(handler: PhysicsController): void {
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
    // console.log(this.world);
  }
}

// world.add({
//   // type of shape : sphere, box, cylinder
//   type: "box",
//   // size of shape
//   size: [1, 1, 1],
//   // start position in degree
//   pos: [0, 0, 0],
//   // start rotation in degree
//   rot: [0, 0, 90],
//   // dynamic or statique
//   move: false,
//   density: 1,
//   friction: 0.2,
//   restitution: 0.2,
//   // The bits of the collision groups to which the shape belongs.
//   belongsTo: 1,
//   // The bits of the collision groups with which the shape collides.
//   collidesWith: 0xffffffff,
// });
