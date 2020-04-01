import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type PhysicsController from "src/framework/interfaces/PhysicsController";

export default interface PhysicsWorld extends AnimatableUpdatable, HasLoggerBreadcrumbs {
  addPhysicsController(handler: PhysicsController): void;

  removePhysicsController(handler: PhysicsController): void;
}
