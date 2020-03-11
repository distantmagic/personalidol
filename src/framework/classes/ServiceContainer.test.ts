import ServiceContainer from "src/framework/classes/ServiceContainer";

type Services = {
  bar: Bar;
  baz: Baz;
  booz: Booz;
  foo: Foo;
  wooz: Wooz;
};

class Foo {}

class Bar {
  readonly foo: Foo;

  constructor(foo: Foo) {
    this.foo = foo;
  }
}

class Baz {
  readonly bar: Bar;

  constructor(bar: Bar) {
    this.bar = bar;
  }
}

class Booz {
  readonly foo: Foo;
  readonly baz: Baz;

  constructor(foo: Foo, baz: Baz) {
    this.baz = baz;
    this.foo = foo;
  }
}

class Wooz {
  readonly baz: Baz;

  constructor(baz: Baz) {
    this.baz = baz;
  }
}

test("builds only necessary dependencies", function() {
  const di = new ServiceContainer<Services>();

  const fooMock = jest.fn(function() {
    return new Foo();
  });

  const barMock = jest.fn(function(dependencies) {
    expect(Object.keys(dependencies)).toEqual(["foo"]);
    expect(dependencies.foo).toBeInstanceOf(Foo);

    return new Bar(dependencies.foo);
  });

  const bazMock = jest.fn(function(dependencies) {
    expect(Object.keys(dependencies)).toEqual(["bar"]);
    expect(dependencies.bar).toBeInstanceOf(Bar);
    expect(dependencies.bar.foo).toBeInstanceOf(Foo);

    return new Baz(dependencies.bar);
  });

  const boozMock = jest.fn(function(dependencies) {
    expect(Object.keys(dependencies)).toEqual(["foo", "baz"]);
    expect(dependencies.foo).toBeInstanceOf(Foo);
    expect(dependencies.baz).toBeInstanceOf(Baz);
    expect(dependencies.baz.bar).toBeInstanceOf(Bar);
    expect(dependencies.baz.bar.foo).toBeInstanceOf(Foo);
    expect(dependencies.baz.bar.foo).toBe(dependencies.foo);

    return new Booz(dependencies.foo, dependencies.baz);
  });

  const woozMock = jest.fn(function(dependencies) {
    expect(Object.keys(dependencies)).toEqual(["baz"]);
    expect(dependencies.baz).toBeInstanceOf(Baz);
    expect(dependencies.baz.bar).toBeInstanceOf(Bar);
    expect(dependencies.baz.bar.foo).toBeInstanceOf(Foo);

    return new Wooz(dependencies.baz);
  });

  di.register("foo", [], fooMock);
  di.register("bar", ["foo"], barMock);
  di.register("baz", ["bar"], bazMock);
  di.register("booz", ["foo", "baz"], boozMock);
  di.register("wooz", ["baz"], woozMock);

  expect(di.getServiceDependencies("foo")).toEqual([]);
  expect(di.getServiceDependencies("bar")).toEqual(["foo"]);
  expect(di.getServiceDependencies("baz")).toEqual(["bar"]);
  expect(di.getServiceDependencies("booz")).toEqual(["foo", "baz"]);
  expect(di.getServiceDependencies("wooz")).toEqual(["baz"]);

  expect(di.reuse("foo")).toBeInstanceOf(Foo);

  expect(fooMock.mock.calls).toHaveLength(1);
  expect(barMock.mock.calls).toHaveLength(0);
  expect(bazMock.mock.calls).toHaveLength(0);
  expect(boozMock.mock.calls).toHaveLength(0);
  expect(woozMock.mock.calls).toHaveLength(0);

  expect(di.reuse("bar")).toBeInstanceOf(Bar);

  expect(fooMock.mock.calls).toHaveLength(2);
  expect(barMock.mock.calls).toHaveLength(1);
  expect(bazMock.mock.calls).toHaveLength(0);
  expect(boozMock.mock.calls).toHaveLength(0);
  expect(woozMock.mock.calls).toHaveLength(0);

  expect(di.reuse("baz")).toBeInstanceOf(Baz);

  expect(fooMock.mock.calls).toHaveLength(3);
  expect(barMock.mock.calls).toHaveLength(2);
  expect(bazMock.mock.calls).toHaveLength(1);
  expect(boozMock.mock.calls).toHaveLength(0);
  expect(woozMock.mock.calls).toHaveLength(0);

  expect(di.reuse("booz")).toBeInstanceOf(Booz);

  expect(fooMock.mock.calls).toHaveLength(4);
  expect(barMock.mock.calls).toHaveLength(3);
  expect(bazMock.mock.calls).toHaveLength(2);
  expect(boozMock.mock.calls).toHaveLength(1);
  expect(woozMock.mock.calls).toHaveLength(0);

  expect(di.reuse("wooz")).toBeInstanceOf(Wooz);

  expect(fooMock.mock.calls).toHaveLength(5);
  expect(barMock.mock.calls).toHaveLength(4);
  expect(bazMock.mock.calls).toHaveLength(3);
  expect(boozMock.mock.calls).toHaveLength(1);
  expect(woozMock.mock.calls).toHaveLength(1);
});
