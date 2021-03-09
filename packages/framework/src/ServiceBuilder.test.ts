import { ServiceBuilder } from "./ServiceBuilder";

type Dependencies = {
  foo: string;
  bar: number;
  baz: boolean;
};

type DependenciesEdgeCaseUndefined = {
  foo: undefined;
  bar: undefined;
};

test("service can be build piece by piece", function (done) {
  const dependencies: Partial<Dependencies> = Object.seal({
    foo: undefined,
    bar: undefined,
    baz: undefined,
  });
  const workerServiceBuilder = ServiceBuilder<Dependencies>("test", dependencies);

  workerServiceBuilder.onready.add(function (built: Dependencies) {
    expect(built).toBe(dependencies);

    expect(dependencies.foo).toBe("test");
    expect(dependencies.bar).toBe(5);
    expect(dependencies.baz).toBe(false);

    done();
  });

  workerServiceBuilder.setDependency("foo", "test");
  workerServiceBuilder.setDependency("bar", 5);
  workerServiceBuilder.setDependency("baz", false);
});

test("fails on unknown field", function () {
  const dependencies: Partial<Dependencies> = Object.seal({
    foo: undefined,
    bar: undefined,
    baz: undefined,
  });
  const workerServiceBuilder = ServiceBuilder<Dependencies>("test", dependencies);

  expect(function () {
    // @ts-ignore we are testing runtime behavior, not types
    workerServiceBuilder.setDependency("booz", "test");
  }).toThrow(`"booz" is not a dependency`);
});

test("waits until all fields are set", function (done) {
  const dependencies: Partial<DependenciesEdgeCaseUndefined> = Object.seal({
    foo: undefined,
    bar: undefined,
  });
  const workerServiceBuilder = ServiceBuilder<DependenciesEdgeCaseUndefined>("test", dependencies);

  workerServiceBuilder.onready.add(function (built: DependenciesEdgeCaseUndefined) {
    expect(built).toBe(dependencies);

    expect(dependencies.foo).toBe(undefined);
    expect(dependencies.bar).toBe(undefined);

    done();
  });

  workerServiceBuilder.setDependency("foo", undefined);

  expect(workerServiceBuilder.isReady()).toBe(false);

  workerServiceBuilder.setDependency("bar", undefined);

  expect(workerServiceBuilder.isReady()).toBe(true);
});
