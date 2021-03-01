import Loglevel from "loglevel";

import { Director } from "./Director";

import type { Scene } from "./Scene.interface";

test("starts and mounts the new scene", function () {
  const logger = Loglevel.getLogger("test");
  const director = Director(logger, "test");

  const sceneState = {
    isDisposed: false,
    isPreloaded: false,
    isPreloading: false,
    isMounted: false,
    isUpdated: false,
  };
  const scene: Scene = {
    id: "0",
    isScene: true,
    isView: false,
    name: "TestScene",
    state: sceneState,

    dispose(): void {
      sceneState.isDisposed = true;
    },

    mount(): void {
      sceneState.isMounted = true;
    },

    preload(): void {
      sceneState.isPreloading = true;
    },

    unmount(): void {
      sceneState.isMounted = false;
    },

    update(): void {
      sceneState.isUpdated = true;
    },
  };

  director.start();

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(null);
  expect(director.state.isTransitioning).toBe(false);
  expect(sceneState.isMounted).toBe(false);
  expect(sceneState.isUpdated).toBe(false);

  director.state.next = scene;
  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(null);
  expect(director.state.isTransitioning).toBe(true);
  expect(sceneState.isMounted).toBe(false);
  expect(sceneState.isUpdated).toBe(false);

  scene.state.isPreloading = true;
  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(null);
  expect(director.state.isTransitioning).toBe(true);
  expect(sceneState.isMounted).toBe(false);
  expect(sceneState.isUpdated).toBe(false);

  scene.state.isPreloaded = true;
  scene.state.isPreloading = false;
  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(scene);
  expect(director.state.isTransitioning).toBe(false);
  expect(sceneState.isMounted).toBe(false);
  expect(sceneState.isUpdated).toBe(false);
});

test("replaces the scene with a new one", function () {
  const logger = Loglevel.getLogger("test");
  const director = Director(logger, "test");

  const sceneState1 = {
    isDisposed: false,
    isPreloaded: false,
    isPreloading: false,
    isMounted: false,
    isUpdated: false,
  };
  const scene1: Scene = {
    id: "1",
    isScene: true,
    isView: false,
    name: "TestScene1",
    state: sceneState1,

    dispose(): void {
      sceneState1.isDisposed = true;
    },

    mount(): void {
      sceneState1.isMounted = true;
    },

    preload(): void {
      sceneState1.isPreloaded = true;
      sceneState1.isPreloading = false;
    },

    unmount(): void {
      sceneState1.isMounted = false;
    },

    update(): void {
      sceneState1.isUpdated = true;
    },
  };

  const sceneState2 = {
    isDisposed: false,
    isPreloaded: false,
    isPreloading: false,
    isMounted: false,
    isUpdated: false,
  };
  const scene2: Scene = {
    id: "2",
    isScene: true,
    isView: false,
    name: "TestScene2",
    state: sceneState2,

    dispose(): void {
      sceneState2.isDisposed = true;
    },

    mount(): void {
      sceneState2.isMounted = true;
    },

    preload(): void {
      sceneState2.isPreloaded = true;
      sceneState2.isPreloading = false;
    },

    unmount(): void {
      sceneState2.isMounted = false;
    },

    update(): void {
      sceneState2.isUpdated = true;
    },
  };

  director.start();

  director.state.next = scene1;

  director.update(0, 0);

  scene1.state.isPreloaded = true;
  scene1.state.isPreloading = false;

  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(scene1);
  expect(director.state.isTransitioning).toBe(false);
  expect(sceneState1.isMounted).toBe(false);
  expect(sceneState1.isUpdated).toBe(false);

  director.state.next = scene2;
  director.update(0, 0);

  expect(director.state.next).toBe(scene2);
  expect(director.state.current).toBe(null);
  expect(director.state.isTransitioning).toBe(true);
  expect(sceneState1.isMounted).toBe(false);
  expect(sceneState1.isUpdated).toBe(false);
  expect(sceneState2.isMounted).toBe(false);
  expect(sceneState2.isUpdated).toBe(false);

  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(null);
  expect(director.state.isTransitioning).toBe(true);
  expect(sceneState1.isMounted).toBe(false);
  expect(sceneState1.isUpdated).toBe(false);
  expect(sceneState2.isMounted).toBe(false);
  expect(sceneState2.isUpdated).toBe(false);

  scene2.state.isPreloaded = true;
  scene2.state.isPreloading = false;

  director.update(0, 0);

  expect(director.state.next).toBe(null);
  expect(director.state.current).toBe(scene2);
  expect(director.state.isTransitioning).toBe(false);
  expect(sceneState1.isMounted).toBe(false);
  expect(sceneState1.isUpdated).toBe(false);
  expect(sceneState2.isMounted).toBe(false);
  expect(sceneState2.isUpdated).toBe(false);
});
