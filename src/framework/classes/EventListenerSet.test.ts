import EventListenerSet from "./EventListenerSet";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("notifies callbacks set about specific event", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mockedCallback = jest.fn();
  const eventListenerSet = new EventListenerSet<[number, number]>(loggerBreadcrumbs);

  eventListenerSet.add(mockedCallback);
  eventListenerSet.notify(Object.freeze([1, 2]));
  eventListenerSet.notify(Object.freeze([3, 4]));

  expect(mockedCallback.mock.calls).toHaveLength(2);
  expect(mockedCallback.mock.calls[0][0]).toBe(1);
  expect(mockedCallback.mock.calls[0][1]).toBe(2);
  expect(mockedCallback.mock.calls[1][0]).toBe(3);
  expect(mockedCallback.mock.calls[1][1]).toBe(4);
});
