import CancelToken from "src/framework/classes/CancelToken";
import EventListenerGenerator from "src/framework/classes/EventListenerGenerator";
import EventListenerSet from "src/framework/classes/EventListenerSet";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("generates subsequent values", async function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const eventListenerSet = new EventListenerSet<[number]>(loggerBreadcrumbs);
  const eventListenerGenerator = new EventListenerGenerator(eventListenerSet);
  const generator = await eventListenerGenerator.generate(cancelToken);

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

  expect(eventListenerSet.getCallbacks()).toHaveLength(0);
  expect(generated).toEqual([[1], [2], [3]]);
}, 100);
