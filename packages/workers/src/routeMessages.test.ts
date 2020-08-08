import { routeMessages } from "./routeMessages";

test("parses and dispatches event names", async function () {
  let _foo = null;

  routeMessages(
    {
      type: "foo",
      messages: {
        foo: "FOO!",
      },
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
    {
      type: "foo+bar",
      messages: {
        bar: "BAR!",
        foo: "FOO!",
      },
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
