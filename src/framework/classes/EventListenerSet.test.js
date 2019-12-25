// @flow

import EventListenerSet from "./EventListenerSet";

test("notifies callbacks set about specific event", function() {
  const mockedCallback = jest.fn();
  const eventListenerSet = new EventListenerSet<[number, number]>();

  eventListenerSet.add(mockedCallback);
  eventListenerSet.notify(Object.freeze([1, 2]));
  eventListenerSet.notify(Object.freeze([3, 4]));

  expect(mockedCallback.mock.calls).toHaveLength(2);
  expect(mockedCallback.mock.calls[0][0]).toBe(1);
  expect(mockedCallback.mock.calls[0][1]).toBe(2);
  expect(mockedCallback.mock.calls[1][0]).toBe(3);
  expect(mockedCallback.mock.calls[1][1]).toBe(4);
});
