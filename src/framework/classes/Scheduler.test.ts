import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";

test("notifies: begin", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onBegin(resolve);
  });

  scheduler.notifyBegin(1, 2);

  return promise;
}, 300);

test("disables callback: begin", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onBegin(resolve);
    scheduler.offBegin(resolve);
    scheduler.onBegin(reject);
  });

  scheduler.notifyBegin(1, 2);

  return expect(promise).rejects.toEqual(1);
}, 300);

test("notifies: draw", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onDraw(resolve);
  });

  scheduler.notifyDraw(3);

  return expect(promise).resolves.toBe(3);
}, 300);

test("disables callback: draw", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onDraw(resolve);
    scheduler.offDraw(resolve);
    scheduler.onDraw(reject);
  });

  scheduler.notifyDraw(3);

  return expect(promise).rejects.toBe(3);
}, 300);

test("notifies: end", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onEnd(function(fps, isPanicked) {
      resolve([fps, isPanicked]);
    });
  });

  scheduler.notifyEnd(25, false);

  return expect(promise).resolves.toEqual([25, false]);
}, 300);

test("disables callback: end", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

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

test("notifies: update", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onUpdate(resolve);
  });

  scheduler.notifyUpdate(16);

  return expect(promise).resolves.toBe(16);
}, 300);

test("disables callback: update", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onUpdate(resolve);
    scheduler.offUpdate(resolve);
    scheduler.onUpdate(reject);
  });

  scheduler.notifyUpdate(16);

  return expect(promise).rejects.toBe(16);
}, 300);
