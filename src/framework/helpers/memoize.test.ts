// @flow strict

import memoize from "./memoize";

test("calls function only when required variables change", function() {
  const mockCallback = jest.fn();

  memoize(mockCallback, [1, 2, 3]);
  memoize(mockCallback, [1, 2, 3]);
  memoize(mockCallback, [4, 5, 6]);
  memoize(mockCallback, [4, 5, 6]);
  memoize(mockCallback, [4, 5, 6]);
  memoize(mockCallback, [1, 2, 3]);

  expect(mockCallback.mock.calls).toHaveLength(3);

  expect(mockCallback.mock.calls[0][0]).toBe(1);
  expect(mockCallback.mock.calls[0][1]).toBe(2);
  expect(mockCallback.mock.calls[0][2]).toBe(3);

  expect(mockCallback.mock.calls[1][0]).toBe(4);
  expect(mockCallback.mock.calls[1][1]).toBe(5);
  expect(mockCallback.mock.calls[1][2]).toBe(6);

  expect(mockCallback.mock.calls[2][0]).toBe(1);
  expect(mockCallback.mock.calls[2][1]).toBe(2);
  expect(mockCallback.mock.calls[2][2]).toBe(3);
});
