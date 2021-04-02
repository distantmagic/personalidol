/// <reference types="@types/ammo.js" />

import { createRouter } from "@personalidol/framework/src/createRouter";
import { preload } from "@personalidol/framework/src/preload";
import { resolveSimulant } from "@personalidol/personalidol/src/resolveSimulant";

import type { Logger } from "loglevel";

import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { SimulantsLookup } from "@personalidol/personalidol/src/SimulantsLookup.type";

function _createAmmoDynamicsWorld(ammo: typeof Ammo) {
  const collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
  const dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache: Ammo.btBroadphaseInterface = (new ammo.btDbvtBroadphase() as unknown) as Ammo.btBroadphaseInterface;
  const solver = new ammo.btSequentialImpulseConstraintSolver();
  const dynamicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

  dynamicsWorld.setGravity(new ammo.btVector3(0, -10, 0));

  return dynamicsWorld;
}

export function createDynamicsWorld(logger: Logger, mainLoop: MainLoop, ammo: typeof Ammo, physicsMessagePort: MessagePort, progressMessagePort: MessagePort): void {
  const dynamicsWorld = _createAmmoDynamicsWorld(ammo);

  console.log(dynamicsWorld);

  physicsMessagePort.onmessage = createRouter({
    registerSimulant(message: MessageSimulantRegister<SimulantsLookup, string & keyof SimulantsLookup>): void {
      const simulant = resolveSimulant<SimulantsLookup>(message);

      preload(logger, simulant);
    },
  });
}

// dynamicsWorld.stepSimulation(delta);
