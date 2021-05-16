import { UIState as IUIState } from "./UIState.type";

function createEmptyState(): IUIState {
  return {
    isInGameMenuOpened: false,
    isInGameMenuTriggerVisible: false,
    isLanguageSettingsScreenOpened: false,
    isMousePointerLayerVisible: false,
    isUserSettingsScreenOpened: false,
    isVirtualJoystickLayerVisible: false,
  };
}

export const UIState = Object.freeze({
  createEmptyState: createEmptyState,
});
