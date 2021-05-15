import { routeMessages } from "./routeMessages";

test("parses and dispatches event names", async function () {
  let _foo = null;

  routeMessages(
    {} as unknown as MessageEvent,
    {
      foo: "FOO!",
    },
    {
      foo: function (message: string) {
        _foo = message;
      },
    }
  );

  expect(_foo).toBe("FOO!");
});

test("dispatches aggregated events", async function () {
  let _foo = null;
  let _bar = null;

  routeMessages(
    {} as unknown as MessageEvent,
    {
      bar: "BAR!",
      foo: "FOO!",
    },
    {
      foo: function (message: string) {
        _foo = message;
      },
      bar: function (message: string) {
        _bar = message;
      },
    }
  );

  expect(_foo).toBe("FOO!");
  expect(_bar).toBe("BAR!");
});
