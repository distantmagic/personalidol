/// <reference types="@types/ammo.js" />

import { createRouter } from "@personalidol/framework/src/createRouter";
import { dispose } from "@personalidol/framework/src/dispose";
import { name } from "@personalidol/framework/src/name";
import { preload } from "@personalidol/framework/src/preload";
import { resolveSimulant } from "@personalidol/personalidol/src/resolveSimulant";

import type { Logger } from "loglevel";

import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MessageSimulantDispose } from "@personalidol/dynamics/src/MessageSimulantDispose.type";
import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { Simulant } from "@personalidol/dynamics/src/Simulant.interface";
import type { SimulantsLookup } from "@personalidol/personalidol/src/SimulantsLookup.type";

const _registeredSimulants: Map<string, Simulant> = new Map();

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

  function _disposeSimulant(id: string): void {
    const simulant: undefined | Simulant = _registeredSimulants.get(id);

    if (!simulant) {
      throw new Error(`No simulant registered with id: "${id}"`);
    }

    dispose(logger, simulant);
  }

  physicsMessagePort.onmessage = createRouter({
    disposeSimulant(message: MessageSimulantDispose): void {
      message.forEach(_disposeSimulant);
    },

    registerSimulant(message: MessageSimulantRegister<SimulantsLookup, string & keyof SimulantsLookup>): void {
      const simulant = resolveSimulant<SimulantsLookup>(message);

      if (_registeredSimulants.has(message.id)) {
        throw new Error(`Duplicate simulant id: "${name(simulant)}"`);
      }

      _registeredSimulants.set(message.id, simulant);

      preload(logger, simulant);
    },
  });
}

// dynamicsWorld.stepSimulation(delta);
