import { h } from "preact";
import { PureComponent } from "preact/compat";

import type { UIState } from "../src/UIState.type";
import type { UIStateUpdateCallback } from "../src/UIStateUpdateCallback.type";

type Props = {
  domMessagePort: MessagePort;
  uiState: UIState;
  uiStateUpdateCallback: UIStateUpdateCallback;
};

const cOptionsEnabled = Object.freeze({
  enabled: true,
  props: {},
});

export class MainMenuScreen extends PureComponent<Props> {
  _navigateToMap = () => {
    this.props.domMessagePort.postMessage({
      navigateToMap: {
        mapName: "map-mountain-caravan",
      },
    });
  };

  _optionsOpen = (evt: Event) => {
    evt.preventDefault();

    this.props.uiState.cOptions = cOptionsEnabled;
    this.props.uiStateUpdateCallback();
  };

  render() {
    return (
      <pi-main-menu>
        <pi-main-menu-button disabled>Continue</pi-main-menu-button>
        <pi-main-menu-button onClick={this._navigateToMap}>New Game</pi-main-menu-button>
        <pi-main-menu-button disabled>Load Game</pi-main-menu-button>
        <pi-main-menu-button onClick={this._optionsOpen}>Options</pi-main-menu-button>
        <pi-main-menu-button disabled>Credits</pi-main-menu-button>
      </pi-main-menu>
    );
  }
}
