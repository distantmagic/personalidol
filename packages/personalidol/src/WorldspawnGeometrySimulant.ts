/// <reference types="@types/ammo.js" />

import { Plane } from "three/src/math/Plane";
import { Vector3 } from "three/src/math/Vector3";

import { buildGeometryPoints } from "@personalidol/quakemaps/src/buildGeometryPoints";
import { createRouter } from "@personalidol/framework/src/createRouter";

import type { Brush } from "@personalidol/quakemaps/src/Brush.type";
import type { MessageFeedbackSimulantPreloaded } from "@personalidol/dynamics/src/MessageFeedbackSimulantPreloaded.type";
import type { Simulant } from "@personalidol/dynamics/src/Simulant.interface";
import type { SimulantsLookup } from "./SimulantsLookup.type";
import type { SimulantState } from "@personalidol/dynamics/src/SimulantState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

function _fixBrushAfterDeserialization(brush: Brush): void {
  for (let halfSpace of brush.halfSpaces) {
    // Sometimes, but not always, the object prototype is messed up after
    // serialization / deserialization.
    if (!halfSpace.plane.isPlane) {
      halfSpace.plane = new Plane(new Vector3(halfSpace.plane.normal.x, halfSpace.plane.normal.y, halfSpace.plane.normal.z), halfSpace.plane.constant);
    }
  }
}

export function WorldspawnGeometrySimulant(id: string, ammo: typeof Ammo, dynamicsWorld: Ammo.btDiscreteDynamicsWorld, simulantFeedbackMessagePort: MessagePort): Simulant {
  const state: SimulantState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const _rigidBodies: Set<Ammo.btRigidBody> = new Set();

  const _simulantFeedbackMessageRouter = createRouter({
    brushes(brushes: Array<Brush>) {
      if (state.isPreloaded) {
        throw new Error("WorldspawnGeometrySimulant is already preloaded, but received brushes.");
      }

      const transform = new ammo.btTransform();

      transform.setIdentity();
      transform.setOrigin(new ammo.btVector3(0, 0, 0));

      const localInertia = new ammo.btVector3(0, 0, 0);
      const myMotionState = new ammo.btDefaultMotionState(transform);

      for (let brush of brushes) {
        _fixBrushAfterDeserialization(brush);

        const shape = new ammo.btConvexHullShape();

        for (let point of buildGeometryPoints([brush])) {
          shape.addPoint(new ammo.btVector3(point.x, point.y, point.z));
        }

        const rbInfo = new ammo.btRigidBodyConstructionInfo(0, myMotionState, shape, localInertia);
        const body = new ammo.btRigidBody(rbInfo);

        _rigidBodies.add(body);
      }

      _onPreloaded();
    },
  });

  function _onPreloaded(): void {
    simulantFeedbackMessagePort.postMessage({
      preloaded: <MessageFeedbackSimulantPreloaded<SimulantsLookup, "worldspawn-geometry">>{
        id: id,
        simulant: "worldspawn-geometry",
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

    for (let rigidBody of _rigidBodies) {
      dynamicsWorld.addRigidBody(rigidBody);
    }
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

    for (let rigidBody of _rigidBodies) {
      dynamicsWorld.removeRigidBody(rigidBody);
    }
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {}

  return Object.freeze({
    id: id,
    isDisposable: true,
    isMountable: true,
    isPreloadable: true,
    isSimulant: true,
    name: "WorldspawnGeometrySimulant",
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
