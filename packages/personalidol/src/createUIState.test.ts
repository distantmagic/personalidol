import { createUIState } from "./createUIState";

test("creates empty UI state", function () {
  expect(createUIState()).toEqual({
    cMainMenu: {
      enabled: false,
      props: {},
    },
    cLoadingError: {
      enabled: false,
      props: {},
    },
    cLoadingScreen: {
      enabled: false,
      props: {},
    },
    cOptions: {
      enabled: false,
      props: {},
    },
  });
});
