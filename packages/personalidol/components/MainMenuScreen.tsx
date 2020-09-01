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
      <main class="main-menu">
        <div class="main-menu__content">
          <h1 class="main-menu__title">Personal Idol</h1>
          <h2 class="main-menu__title-sub">Apocalyptic Adventure</h2>
          <nav class="main-menu__nav">
            <button disabled>Continue</button>
            <button onClick={this._navigateToMap}>New Game</button>
            <button disabled>Load Game</button>
            <button onClick={this._optionsOpen}>Options</button>
            <button disabled>Credits</button>
          </nav>
        </div>
      </main>
    );
  }
}
