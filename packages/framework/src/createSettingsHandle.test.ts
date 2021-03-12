import { createSettingsHandle } from "./createSettingsHandle";
import { noop } from "./noop";
import { UserSettings } from "./UserSettings";

import type { UserSettings as IUserSettings } from "./UserSettings.type";

test("callbck is called only when settings are changed", function () {
  const userSettings: IUserSettings = UserSettings.createEmptyState();
  const mockCallback = jest.fn(noop);

  const applySettings = createSettingsHandle(userSettings, mockCallback);

  // 1. apply with no changes, should be triggered the first time
  applySettings();

  expect(mockCallback.mock.calls).toHaveLength(1);

  // 2. change a setting
  userSettings.showStatsReporter = !userSettings.showStatsReporter;

  // 3. should not be invoked
  applySettings();

  expect(mockCallback.mock.calls).toHaveLength(1);

  // 4. bump settings version
  userSettings.version += 1;

  // 5. should be invoked now
  applySettings();

  expect(mockCallback.mock.calls).toHaveLength(2);

  // 6. try to apply again to see if version is stored
  applySettings();

  expect(mockCallback.mock.calls).toHaveLength(2);
});
