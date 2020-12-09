import { createUIState } from "./createUIState";

test("creates empty UI state", function () {
  expect(createUIState()).toEqual({
    "pi-main-menu": {
      enabled: false,
      props: {},
    },
    "pi-fatal-error": {
      enabled: false,
      props: {},
    },
    "pi-loading-screen": {
      enabled: false,
      props: {},
    },
    "pi-options": {
      enabled: false,
      props: {},
    },
  });
});
