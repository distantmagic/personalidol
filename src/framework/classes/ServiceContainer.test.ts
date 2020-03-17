import ServiceBuilder from "src/framework/classes/ServiceBuilder";
import ServiceContainer from "src/framework/classes/ServiceContainer";

import { default as ServicesType } from "src/framework/types/Services";

type Services = {
  foo: Foo;
  bar: Bar;
  baz: Baz;
  booz: Booz;
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

  // --------------------------------------------------------------------------
  // Foo

  const buildFoo = jest.fn(function() {
    return new Foo();
  });

  di.register(
    new (class extends ServiceBuilder<Services, "foo"> {
      readonly key: "foo" = "foo";

      build(): Foo {
        return buildFoo();
      }
    })()
  );

  // --------------------------------------------------------------------------
  // Bar

  const buildBar = jest.fn(function(dependencies: Pick<ServicesType, "foo">) {
    return new Bar(dependencies.foo);
  });

  di.register(
    new (class extends ServiceBuilder<
      Services,
      "bar",
      {
        foo: Foo;
      }
    > {
      readonly dependencies: ["foo"] = ["foo"];
      readonly key: "bar" = "bar";

      build(dependencies: Pick<ServicesType, "foo">): Bar {
        return buildBar(dependencies);
      }
    })()
  );

  // --------------------------------------------------------------------------
  // Baz

  const buildBaz = jest.fn(function(dependencies: Pick<ServicesType, "bar">) {
    return new Baz(dependencies.bar);
  });

  di.register(
    new (class extends ServiceBuilder<
      Services,
      "baz",
      {
        bar: Bar;
      }
    > {
      readonly dependencies: ["bar"] = ["bar"];
      readonly key: "baz" = "baz";

      build(dependencies: Pick<ServicesType, "bar">): Baz {
        return buildBaz(dependencies);
      }
    })()
  );

  // --------------------------------------------------------------------------
  // Booz

  const buildBooz = jest.fn(function(dependencies: Pick<ServicesType, "baz" | "foo">) {
    return new Booz(dependencies.foo, dependencies.baz);
  });

  di.register(
    new (class extends ServiceBuilder<
      Services,
      "booz",
      {
        baz: Baz;
        foo: Foo;
      }
    > {
      readonly dependencies: ReadonlyArray<"baz" | "foo"> = ["baz", "foo"];
      readonly key: "booz" = "booz";

      build(dependencies: Pick<ServicesType, "baz" | "foo">): Booz {
        return buildBooz(dependencies);
      }
    })()
  );

  // --------------------------------------------------------------------------
  // Wooz

  const buildWooz = jest.fn(function(dependencies: Pick<ServicesType, "baz">) {
    return new Wooz(dependencies.baz);
  });

  di.register(
    new (class extends ServiceBuilder<
      Services,
      "wooz",
      {
        baz: Baz;
      }
    > {
      readonly dependencies: ReadonlyArray<"baz"> = ["baz"];
      readonly key: "wooz" = "wooz";

      build(dependencies: Pick<ServicesType, "baz">): Wooz {
        return buildWooz(dependencies);
      }
    })()
  );

  expect(di.reuse("foo")).toBeInstanceOf(Foo);

  expect(buildFoo.mock.calls.length).toBe(1);
  expect(buildBar.mock.calls.length).toBe(0);
  expect(buildBaz.mock.calls.length).toBe(0);
  expect(buildBooz.mock.calls.length).toBe(0);
  expect(buildWooz.mock.calls.length).toBe(0);

  expect(di.reuse("bar")).toBeInstanceOf(Bar);

  expect(buildFoo.mock.calls.length).toBe(2);
  expect(buildBar.mock.calls.length).toBe(1);
  expect(buildBaz.mock.calls.length).toBe(0);
  expect(buildBooz.mock.calls.length).toBe(0);
  expect(buildWooz.mock.calls.length).toBe(0);

  expect(di.reuse("baz")).toBeInstanceOf(Baz);

  expect(buildFoo.mock.calls.length).toBe(3);
  expect(buildBar.mock.calls.length).toBe(2);
  expect(buildBaz.mock.calls.length).toBe(1);
  expect(buildBooz.mock.calls.length).toBe(0);
  expect(buildWooz.mock.calls.length).toBe(0);

  expect(di.reuse("booz")).toBeInstanceOf(Booz);

  expect(buildFoo.mock.calls.length).toBe(4);
  expect(buildBar.mock.calls.length).toBe(3);
  expect(buildBaz.mock.calls.length).toBe(2);
  expect(buildBooz.mock.calls.length).toBe(1);
  expect(buildWooz.mock.calls.length).toBe(0);

  expect(di.reuse("wooz")).toBeInstanceOf(Wooz);
});
