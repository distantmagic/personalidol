import type * as OIMO from "oimo";

import type PhysicsShape from "src/framework/interfaces/PhysicsShape";

export default interface PhysicsController extends PhysicsShape {
  isStatic(): boolean;

  getPhysicsBody(): OIMO.Body;

  hasPhysicsBody(): boolean;

  setPhysicsBody(body: OIMO.Body): void;

  setPosition(x: number, y: number, z: number): void;

  setRotationQuaternion(x: number, y: number, z: number, w: number): void;
}
