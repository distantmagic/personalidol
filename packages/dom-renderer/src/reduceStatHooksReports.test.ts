import { reduceStatHooksReports } from "./reduceStatHooksReports";

test("sums up test reports", function () {
  const reduced = reduceStatHooksReports("foo", [
    {
      currentInterval: 0,
      currentIntervalDuration: 1,
      currentIntervalTicks: 100,
      debugName: "foo",
    },
    {
      currentInterval: 0,
      currentIntervalDuration: 2,
      currentIntervalTicks: 102,
      debugName: "foo",
    },
    {
      currentInterval: 0,
      currentIntervalDuration: 1,
      currentIntervalTicks: 104,
      debugName: "foo",
    },
    {
      currentInterval: 0,
      currentIntervalDuration: 1,
      currentIntervalTicks: 98,
      debugName: "foo",
    },
  ]);

  expect(reduced.averageTicks).toBe(80.8);
});
