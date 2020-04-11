import type * as OIMO from "oimo";
import type * as THREE from "three";

import type PhysicsShape from "src/framework/interfaces/PhysicsShape";

export default interface PhysicsController extends PhysicsShape {
  isStatic(): boolean;

  getPhysicsBody(): OIMO.Body;

  hasPhysicsBody(): boolean;

  setPhysicsBody(body: OIMO.Body): void;

  setPosition(x: number, y: number, z: number): void;

  setRotation(quaternion: THREE.Quaternion): void;

  // updateFromPhysicsBody(body: OIMO.Body): void;
}
