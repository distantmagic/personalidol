declare module "ammo.js" {
  declare class btCollisionDispatcher {
    constructor(configuration: btDefaultCollisionConfiguration);
  }

  declare class btDbvtBroadphase {}

  declare class btDefaultCollisionConfiguration {}

  declare class btDiscreteDynamicsWorld {
    constructor(
      dispatcher: btCollisionDispatcher,
      overlappingPairCache: btDbvtBroadphase,
      solver: btSequentialImpulseConstraintSolver,
      collisionConfiguration: btDefaultCollisionConfiguration
    );

    setGravity(gravity: byVector3);
  }

  declare class btSequentialImpulseConstraintSolver {}

  declare class btVector3 {
    constructor(x: number, y: number, z: number);
  }
}
