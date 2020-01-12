import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";

test("notifies: begin", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onBegin(resolve);
  });

  scheduler.notifyBegin();

  return promise;
}, 300);

test("disables callback: begin", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onBegin(resolve);
    scheduler.offBegin(resolve);
    scheduler.onBegin(reject);
  });

  scheduler.notifyBegin();

  await expect(promise).rejects.toBe();
}, 300);

test("notifies: draw", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onDraw(resolve);
  });

  scheduler.notifyDraw(3);

  await expect(promise).resolves.toBe(3);
}, 300);

test("disables callback: draw", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onDraw(resolve);
    scheduler.offDraw(resolve);
    scheduler.onDraw(reject);
  });

  scheduler.notifyDraw(3);

  await expect(promise).rejects.toBe(3);
}, 300);

test("notifies: end", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onEnd(function(fps, isPanicked) {
      resolve([fps, isPanicked]);
    });
  });

  scheduler.notifyEnd(25, false);

  await expect(promise).resolves.toEqual([25, false]);
}, 300);

test("disables callback: end", async function() {
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

  await expect(promise).rejects.toEqual([25, false]);
}, 300);

test("notifies: update", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    scheduler.onUpdate(resolve);
  });

  scheduler.notifyUpdate(16);

  await expect(promise).resolves.toBe(16);
}, 300);

test("disables callback: update", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  const promise = new Promise(function(resolve, reject) {
    scheduler.onUpdate(resolve);
    scheduler.offUpdate(resolve);
    scheduler.onUpdate(reject);
  });

  scheduler.notifyUpdate(16);

  await expect(promise).rejects.toBe(16);
}, 300);
