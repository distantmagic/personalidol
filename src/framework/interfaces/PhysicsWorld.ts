import type * as OIMO from "oimo";

import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";
import type PhysicsShape from "src/framework/interfaces/PhysicsShape";

export default interface PhysicsWorld extends AnimatableUpdatable, HasLoggerBreadcrumbs {
  addPhysicsController(handler: PhysicsController): OIMO.Body;

  addPhysicsShape(shape: PhysicsShape): OIMO.Body;

  removePhysicsController(handler: PhysicsController): void;

  removePhysicsShape(shape: PhysicsShape): void;
}
