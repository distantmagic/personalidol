import type * as OIMO from "oimo";
import type * as THREE from "three";

export default interface PhysicsController {
  isStatic(): boolean;

  getInstanceId(): string;

  getPosition(): THREE.Vector3;

  getPhysicsBody(): OIMO.Body;

  setPhysicsBody(body: OIMO.Body): void;

  setPosition(x: number, y: number, z: number): void;

  setRotationQuaternion(x: number, y: number, z: number, w: number): void;
}
