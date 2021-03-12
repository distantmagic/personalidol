import { invoke } from "./invoke";
import { noop } from "./noop";

test("invokes the function with no arguments", function () {
  const set: Set<Function> = new Set();

  const mockCallback1 = jest.fn(noop);
  const mockCallback2 = jest.fn(noop);

  set.add(mockCallback1);
  set.add(mockCallback2);

  set.forEach(invoke);

  expect(mockCallback1.mock.calls).toHaveLength(1);
  expect(mockCallback2.mock.calls).toHaveLength(1);
});
