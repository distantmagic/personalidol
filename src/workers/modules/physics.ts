/// <reference lib="webworker" />

import * as OIMO from "oimo";
import MainLoop from "mainloop.js";

declare var self: DedicatedWorkerGlobalScope;

const world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  // 1 brute force, 2 sweep and prune, 3 volume tree
  broadphase: 2,
  // scale full world
  worldscale: 1,
  // randomize sample
  random: true,
  // calculate statistic or not
  info: true,
  gravity: [0, -9.8, 0],
});

MainLoop.setEnd(function(fps: number) {});

MainLoop.setUpdate(function(delta: number) {
  world.step();
});

MainLoop.start();

function onMessagePortMessage(evt: MessageEvent) {
  // console.log(evt.data);
  const body = world.add({
    // type of shape : sphere, box, cylinder
    type: "box",
    // size of shape
    size: [1, 1, 1],
    // start position in degree
    pos: [0, 0, 0],
    // start rotation in degree
    rot: [0, 0, 90],
    // dynamic or statique
    move: false,
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    // The bits of the collision groups to which the shape belongs.
    belongsTo: 1,
    // The bits of the collision groups with which the shape collides.
    collidesWith: 0xffffffff,
  });

  // console.log(body);
}

function onWorkerMessage(evt: MessageEvent) {
  const messagePort: MessagePort = evt.data;

  messagePort.onmessage = onMessagePortMessage;
}

self.onmessage = onWorkerMessage;
