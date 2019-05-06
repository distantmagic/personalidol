// @flow

import DedicatedWorkerGlobalScopeMock from "./DedicatedWorkerGlobalScope";
import WorkerMock from "./Worker";

it("has basic functionalities of a web worker", async function() {
  const worker = new WorkerMock("https://example.com");
  const workerScope = new DedicatedWorkerGlobalScopeMock(worker);

  const request = new Promise(function(resolve) {
    workerScope.onmessage = function(evt) {
      resolve(evt.data);
      workerScope.postMessage("hello");
    };
  });

  const response = new Promise(function(resolve) {
    worker.onmessage = function(evt) {
      resolve(evt.data);
    };
  });

  worker.postMessage("test");

  await expect(request).resolves.toEqual("test");
  await expect(response).resolves.toEqual("hello");
}, 300);
