/// <reference types="@types/ammo.js" />

import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { dispose } from "@personalidol/framework/src/dispose";
import { mount } from "@personalidol/framework/src/mount";
import { name } from "@personalidol/framework/src/name";
import { preload } from "@personalidol/framework/src/preload";
import { unmount } from "@personalidol/framework/src/unmount";

import type { Logger } from "loglevel";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { DynamicsWorld as IDynamicsWorld } from "./DynamicsWorld.interface";
import type { DynamicsWorldInfo } from "./DynamicsWorldInfo.type";
import type { DynamicsWorldState } from "./DynamicsWorldState.type";
import type { MessageSimulantDispose } from "./MessageSimulantDispose.type";
import type { MessageSimulantRegister } from "./MessageSimulantRegister.type";
import type { Simulant } from "./Simulant.interface";
import type { SimulantFactory } from "./SimulantFactory.interface";
import type { SimulantsLookup } from "./SimulantsLookup.type";

function _createAmmoDynamicsWorld(ammo: typeof Ammo) {
  const collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
  const dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache: Ammo.btBroadphaseInterface = (new ammo.btDbvtBroadphase() as unknown) as Ammo.btBroadphaseInterface;
  const solver = new ammo.btSequentialImpulseConstraintSolver();
  const dynamicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

  dynamicsWorld.setGravity(new ammo.btVector3(0, -1000, 0));

  return dynamicsWorld;
}

/**
 * `DynamicsWorlds` needs to run with `DynamicsMainLoopTicker`, because it
 * expects constant timestep in physics simulation.
 */
export function DynamicsWorld<S extends SimulantsLookup>(
  logger: Logger,
  ammo: typeof Ammo,
  simulantFactory: SimulantFactory<S>,
  tickTimerState: TickTimerState,
  dynamicsMessagePort: MessagePort,
  progressMessagePort: MessagePort
): IDynamicsWorld<S> {
  const info: DynamicsWorldInfo = Object.seal({
    registeredSimulants: 0,
  });
  const state: DynamicsWorldState = Object.seal({
    needsUpdates: true,
  });

  const _dynamicsWorld = _createAmmoDynamicsWorld(ammo);
  const _registeredSimulants: Map<string, Simulant> = new Map();

  const _physicsMessageRouter = createRouter({
    disposeSimulant(message: MessageSimulantDispose): void {
      message.forEach(_disposeSimulant);
    },

    registerSimulant(message: MessageSimulantRegister<S, string & keyof S>): void {
      const simulant = simulantFactory.create(ammo, _dynamicsWorld, message);

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

    if (simulant.state.isMounted) {
      unmount(logger, simulant);
    }

    dispose(logger, simulant);

    _registeredSimulants.delete(id);
    info.registeredSimulants = _registeredSimulants.size;
  }

  function _updateSimulant(simulant: Simulant): void {
    if (!simulant.state.isPreloaded) {
      return;
    }

    if (!simulant.state.isMounted) {
      mount(logger, simulant);

      return;
    }

    simulant.update(tickTimerState.delta, tickTimerState.elapsedTime, tickTimerState);
  }

  function start(): void {
    dynamicsMessagePort.onmessage = _physicsMessageRouter;
  }

  function stop(): void {
    dynamicsMessagePort.onmessage = null;
  }

  function update(delta: number): void {
    _registeredSimulants.forEach(_updateSimulant);
    _dynamicsWorld.stepSimulation(delta, 0, 1);
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
