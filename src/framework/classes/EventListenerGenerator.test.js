// @flow

import CancelToken from "./CancelToken";
import EventListenerGenerator from "./EventListenerGenerator";
import EventListenerSet from "./EventListenerSet";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("generates subsequent values", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const eventListenerSet = new EventListenerSet<[number]>();
  const eventListenerGenerator = new EventListenerGenerator(eventListenerSet);
  const generator = eventListenerGenerator.generate(cancelToken);

  expect(eventListenerSet.callbacks).toHaveLength(1);

  eventListenerSet.notify([1]);
  eventListenerSet.notify([2]);
  eventListenerSet.notify([3]);

  const generated = [];

  for await (let event of generator) {
    generated.push(event);

    if (generated.length > 2) {
      break;
    }
  }

  expect(eventListenerSet.callbacks).toHaveLength(0);
  expect(generated).toEqual([[1], [2], [3]]);
}, 100);
