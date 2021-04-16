/// <reference types="@types/ammo.js" />

import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { dispose } from "@personalidol/framework/src/dispose";
import { name } from "@personalidol/framework/src/name";
import { preload } from "@personalidol/framework/src/preload";

import type { Logger } from "loglevel";

import type { DynamicsWorld as IDynamicsWorld } from "./DynamicsWorld.interface";
import type { DynamicsWorldInfo } from "./DynamicsWorldInfo.type";
import type { DynamicsWorldState } from "./DynamicsWorldState.type";
import type { MessageSimulantDispose } from "./MessageSimulantDispose.type";
import type { MessageSimulantRegister } from "./MessageSimulantRegister.type";
import type { Simulant } from "./Simulant.interface";
import type { SimulantFactory } from "./SimulantFactory.interface";
import type { SimulantsLookup } from "./SimulantsLookup.type";

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

export function DynamicsWorld<S extends SimulantsLookup>(
  logger: Logger,
  ammo: typeof Ammo,
  simulantFactory: SimulantFactory<S>,
  dynamicsMessagePort: MessagePort,
  progressMessagePort: MessagePort
): IDynamicsWorld<S> {
  const _dynamicsWorld = _createAmmoDynamicsWorld(ammo);
  const info: DynamicsWorldInfo = Object.seal({
    registeredSimulants: 0,
  });
  const state: DynamicsWorldState = Object.seal({
    needsUpdates: true,
  });

  const _physicsMessageRouter = createRouter({
    disposeSimulant(message: MessageSimulantDispose): void {
      message.forEach(_disposeSimulant);
    },

    registerSimulant(message: MessageSimulantRegister<S, string & keyof S>): void {
      const simulant = simulantFactory.create(message);

      if (_registeredSimulants.has(message.id)) {
        throw new Error(`Duplicate simulant id: "${name(simulant)}"`);
      }

      _registeredSimulants.set(message.id, simulant);
      info.registeredSimulants = _registeredSimulants.size;

      preload(logger, simulant);
    },
  });

  function _disposeSimulant(id: string): void {
    const simulant: undefined | Simulant = _registeredSimulants.get(id);

    if (!simulant) {
      throw new Error(`No simulant registered with id: "${id}"`);
    }

    dispose(logger, simulant);

    _registeredSimulants.delete(id);
    info.registeredSimulants = _registeredSimulants.size;
  }

  function start(): void {
    dynamicsMessagePort.onmessage = _physicsMessageRouter;
  }

  function stop(): void {
    dynamicsMessagePort.onmessage = null;
  }

  function update(delta: number): void {
    _dynamicsWorld.stepSimulation(delta);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    info: info,
    isDynamicsWorld: true,
    name: "DynamicsWorld",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
