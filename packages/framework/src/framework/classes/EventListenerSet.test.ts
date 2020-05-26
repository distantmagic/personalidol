import noop from "lodash/noop";

import EventListenerSet from "src/framework/classes/EventListenerSet";
import Exception from "src/framework/classes/Exception";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("cannot add the same callback more than once", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const eventListenerSet = new EventListenerSet<[number]>(loggerBreadcrumbs);

  eventListenerSet.add(noop);

  expect(function () {
    eventListenerSet.add(noop);
  }).toThrow(Exception);
});

test("cannot delete callback that is not previously added", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const eventListenerSet = new EventListenerSet<[number]>(loggerBreadcrumbs);

  expect(function () {
    eventListenerSet.delete(noop);
  }).toThrow(Exception);
});

test("notifies callbacks set about specific event", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mockedCallback = jest.fn();
  const eventListenerSet = new EventListenerSet<[number, number]>(loggerBreadcrumbs);

  eventListenerSet.add(mockedCallback);
  eventListenerSet.notify([1, 2]);
  eventListenerSet.notify([3, 4]);

  expect(mockedCallback.mock.calls).toHaveLength(2);
  expect(mockedCallback.mock.calls[0][0]).toBe(1);
  expect(mockedCallback.mock.calls[0][1]).toBe(2);
  expect(mockedCallback.mock.calls[1][0]).toBe(3);
  expect(mockedCallback.mock.calls[1][1]).toBe(4);
});

test("optimizes notify calls", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  // 0 arguments
  const mockedCallback0 = jest.fn();
  const eventListenerSet0 = new EventListenerSet<[]>(loggerBreadcrumbs);

  eventListenerSet0.add(mockedCallback0);
  eventListenerSet0.notify([]);
  expect(mockedCallback0.mock.calls).toHaveLength(1);
  expect(mockedCallback0.mock.calls[0]).toHaveLength(0);

  // 1 argument
  const mockedCallback1 = jest.fn();
  const eventListenerSet1 = new EventListenerSet<[number]>(loggerBreadcrumbs);

  eventListenerSet1.add(mockedCallback1);
  eventListenerSet1.notify([1]);
  expect(mockedCallback1.mock.calls).toHaveLength(1);
  expect(mockedCallback1.mock.calls[0]).toHaveLength(1);
  expect(mockedCallback1.mock.calls[0][0]).toBe(1);

  // 2 arguments
  const mockedCallback2 = jest.fn();
  const eventListenerSet2 = new EventListenerSet<[number, number]>(loggerBreadcrumbs);

  eventListenerSet2.add(mockedCallback2);
  eventListenerSet2.notify([1, 2]);
  expect(mockedCallback2.mock.calls).toHaveLength(1);
  expect(mockedCallback2.mock.calls[0]).toHaveLength(2);
  expect(mockedCallback2.mock.calls[0][0]).toBe(1);
  expect(mockedCallback2.mock.calls[0][1]).toBe(2);

  // 3 arguments
  const mockedCallback3 = jest.fn();
  const eventListenerSet3 = new EventListenerSet<[number, number, number]>(loggerBreadcrumbs);

  eventListenerSet3.add(mockedCallback3);
  eventListenerSet3.notify([1, 2, 3]);
  expect(mockedCallback3.mock.calls).toHaveLength(1);
  expect(mockedCallback3.mock.calls[0]).toHaveLength(3);
  expect(mockedCallback3.mock.calls[0][0]).toBe(1);
  expect(mockedCallback3.mock.calls[0][1]).toBe(2);
  expect(mockedCallback3.mock.calls[0][2]).toBe(3);

  // N arguments
  const mockedCallback4 = jest.fn();
  const eventListenerSet4 = new EventListenerSet<[number, number, number, number]>(loggerBreadcrumbs);

  eventListenerSet4.add(mockedCallback4);
  eventListenerSet4.notify([1, 2, 3, 4]);
  expect(mockedCallback4.mock.calls).toHaveLength(1);
  expect(mockedCallback4.mock.calls[0]).toHaveLength(4);
  expect(mockedCallback4.mock.calls[0][0]).toBe(1);
  expect(mockedCallback4.mock.calls[0][1]).toBe(2);
  expect(mockedCallback4.mock.calls[0][2]).toBe(3);
  expect(mockedCallback4.mock.calls[0][3]).toBe(4);
});
