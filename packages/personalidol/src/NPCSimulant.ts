/// <reference types="@types/ammo.js" />

import { createRouter } from "@personalidol/framework/src/createRouter";

import type { MessageFeedbackSimulantPreloaded } from "@personalidol/dynamics/src/MessageFeedbackSimulantPreloaded.type";
import type { Simulant } from "@personalidol/dynamics/src/Simulant.interface";
import type { SimulantState } from "@personalidol/dynamics/src/SimulantState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { NPCEntity } from "./NPCEntity.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export function NPCSimulant(id: string, ammo: typeof Ammo, dynamicsWorld: Ammo.btDiscreteDynamicsWorld, simulantFeedbackMessagePort: MessagePort): Simulant {
  const state: SimulantState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  // Reduce the memory leaks by sharing this object.
  const _transform: Ammo.btTransform = new ammo.btTransform();

  let _npcRigidBody: null | Ammo.btRigidBody = null;

  const _simulantFeedbackMessageRouter = createRouter({
    applyCentralImpulse(impulse: Vector3Simple) {
      if (!_npcRigidBody) {
        throw new Error("NPC rigid body is not ready but received a central impulse");
      }

      _npcRigidBody.applyCentralImpulse(new ammo.btVector3(impulse.x, impulse.y, impulse.z));
    },

    entity(entity: NPCEntity) {
      const npcMass = 1;
      const npcLocalInertia = new ammo.btVector3(0, 0, 0);
      const npcShape = new ammo.btSphereShape(10);

      npcShape.calculateLocalInertia(npcMass, npcLocalInertia);

      const startTransform = new ammo.btTransform();

      startTransform.setIdentity();

      const npcMotionState = new ammo.btDefaultMotionState(startTransform);
      const rbInfo = new ammo.btRigidBodyConstructionInfo(npcMass, npcMotionState, npcShape, npcLocalInertia);

      _npcRigidBody = new ammo.btRigidBody(rbInfo);

      const origin = _npcRigidBody.getWorldTransform().getOrigin();

      origin.setX(entity.origin.x);
      origin.setY(entity.origin.y);
      origin.setZ(entity.origin.z);

      const rotation = _npcRigidBody.getWorldTransform().getRotation();

      rotation.setX(1);
      rotation.setY(0);
      rotation.setZ(0);
      rotation.setW(1);

      _onPreloaded();
    },
  });

  function _onPreloaded(): void {
    simulantFeedbackMessagePort.postMessage({
      preloaded: <MessageFeedbackSimulantPreloaded<SimulantsLookup, "npc">>{
        id: id,
        simulant: "npc",
      },
    });

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function dispose(): void {
    state.isDisposed = true;

    simulantFeedbackMessagePort.close();
  }

  function mount(): void {
    state.isMounted = true;

    if (!_npcRigidBody) {
      throw new Error("Rigid body is not ready and simulant can't be mounted.");
    }

    _npcRigidBody.activate();
    dynamicsWorld.addRigidBody(_npcRigidBody);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;

    simulantFeedbackMessagePort.onmessage = _simulantFeedbackMessageRouter;
  }

  function unmount(): void {
    state.isMounted = false;

    if (!_npcRigidBody) {
      throw new Error("Rigid body is not ready and simulant can't be unmounted.");
    }

    dynamicsWorld.removeRigidBody(_npcRigidBody);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    if (!_npcRigidBody) {
      throw new Error("Rigid body is not ready but simulant was updated.");
    }

    _npcRigidBody.getMotionState().getWorldTransform(_transform);

    const origin = _transform.getOrigin();

    simulantFeedbackMessagePort.postMessage({
      origin: {
        x: origin.x(),
        y: origin.y(),
        z: origin.z(),
      },
    });

    // const rotation = _transform.getRotation();

    // console.log(origin.x(), origin.y(), origin.z());
    // object[3] = rotation.x();
    // object[4] = rotation.y();
    // object[5] = rotation.z();
    // object[6] = rotation.w();
  }

  return Object.freeze({
    id: id,
    isDisposable: true,
    isMountable: true,
    isPreloadable: true,
    isSimulant: true,
    name: "NPCSimulant",
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
