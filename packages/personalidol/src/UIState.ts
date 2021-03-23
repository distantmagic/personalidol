import { UIState as IUIState } from "./UIState.type";

function createEmptyState(): IUIState {
  return {
    currentMap: null,
    isInGameMenuOpened: false,
    isInGameMenuTriggerVisible: false,
    isLanguageSettingsScreenOpened: false,
    isMousePointerLayerVisible: false,
    isScenePaused: false,
    isUserSettingsScreenOpened: false,
    isVirtualJoystickLayerVisible: false,
  };
}

export const UIState = Object.freeze({
  createEmptyState: createEmptyState,
});
