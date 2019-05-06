// @flow

import DedicatedWorkerGlobalScopeMock from "../mocks/DedicatedWorkerGlobalScope";
import WorkerClientController from "./WorkerClientController";
import WorkerContextController from "./WorkerContextController";
import WorkerMock from "../mocks/Worker";

it("hooks up into worker client", function() {
  class Methods {
    async someMethod(params) {
      return {
        baz: `${params.foo}.wooz`
      };
    }
  }

  const worker = new WorkerMock("https://example.com/worker.js");
  const workerContext = new DedicatedWorkerGlobalScopeMock(worker);
  const workerContextController = new WorkerContextController<Methods>(
    workerContext
  );
  const workerController = new WorkerClientController<Methods>(worker);

  workerContextController.setMethods(new Methods());
  workerContextController.attach();

  const response = workerController.request("someMethod", {
    foo: "bar"
  });

  return expect(response).resolves.toEqual({
    baz: "bar.wooz"
  });
}, 300);

it("handles worker exceptions", function() {
  class Methods {
    async someMethod() {
      throw new Error("foo");
    }
  }

  const worker = new WorkerMock("https://example.com/worker.js");
  const workerContext = new DedicatedWorkerGlobalScopeMock(worker);
  const workerContextController = new WorkerContextController<Methods>(
    workerContext
  );
  const workerController = new WorkerClientController<Methods>(worker);

  workerContextController.setMethods(new Methods());
  workerContextController.attach();

  const response = workerController.request("someMethod", {});

  return expect(response).rejects.toEqual({
    code: 0,
    message: "foo"
  });
}, 300);
