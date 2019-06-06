// @flow

import EventListenerSet from "./EventListenerSet";

it("notifies callbacks set about specific event", function() {
  const mockedCallback = jest.fn();
  const eventListenerSet = new EventListenerSet<[number, number]>();

  eventListenerSet.add(mockedCallback);
  eventListenerSet.notify([1, 2]);

  expect(mockedCallback.mock.calls.length).toBe(1);
  expect(mockedCallback.mock.calls[0][0]).toBe(1);
  expect(mockedCallback.mock.calls[0][1]).toBe(2);
});
