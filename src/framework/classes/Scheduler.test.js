// @flow

import Scheduler from "./Scheduler";

it("notifies: begin", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve) {
    scheduler.onBegin(resolve);
  });

  scheduler.notifyBegin();

  return promise;
}, 300);

it("disables callback: begin", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve, reject) {
    scheduler.onBegin(resolve);
    scheduler.offBegin(resolve);
    scheduler.onBegin(reject);
  });

  scheduler.notifyBegin();

  return expect(promise).rejects.toBe();
}, 300);

it("notifies: draw", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve) {
    scheduler.onDraw(resolve);
  });

  scheduler.notifyDraw(3);

  return expect(promise).resolves.toBe(3);
}, 300);

it("disables callback: draw", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve, reject) {
    scheduler.onDraw(resolve);
    scheduler.offDraw(resolve);
    scheduler.onDraw(reject);
  });

  scheduler.notifyDraw(3);

  return expect(promise).rejects.toBe(3);
}, 300);

it("notifies: end", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve) {
    scheduler.onEnd(function(fps, isPanicked) {
      resolve([fps, isPanicked]);
    });
  });

  scheduler.notifyEnd(25, false);

  return expect(promise).resolves.toEqual([25, false]);
}, 300);

it("disables callback: end", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve, reject) {
    scheduler.onEnd(resolve);
    scheduler.offEnd(resolve);
    scheduler.onEnd(function(fps, isPanicked) {
      reject([fps, isPanicked]);
    });
  });

  scheduler.notifyEnd(25, false);

  return expect(promise).rejects.toEqual([25, false]);
}, 300);

it("notifies: update", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve) {
    scheduler.onUpdate(resolve);
  });

  scheduler.notifyUpdate(16);

  return expect(promise).resolves.toBe(16);
}, 300);

it("disables callback: update", function() {
  const scheduler = new Scheduler();

  const promise = new Promise(function(resolve, reject) {
    scheduler.onUpdate(resolve);
    scheduler.offUpdate(resolve);
    scheduler.onUpdate(reject);
  });

  scheduler.notifyUpdate(16);

  return expect(promise).rejects.toBe(16);
}, 300);
