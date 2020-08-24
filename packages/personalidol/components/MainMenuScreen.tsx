import { h } from "preact";
import { PureComponent } from "preact/compat";

import { uiMap } from "../src/uiMap";
import { uiOptionsOpen } from "../src/uiOptionsOpen";

type Props = {
  uiMessagePort: MessagePort;
};

function _navigateToMap(self: MainMenuScreen, uiMessagePort: MessagePort, filename: string) {
  return function () {
    uiMap(uiMessagePort, filename);
  };
}

function _optionsOpen(self: MainMenuScreen, uiMessagePort: MessagePort) {
  return function () {
    uiOptionsOpen(uiMessagePort);
  };
}

export class MainMenuScreen extends PureComponent<Props> {
  render() {
    return (
      <main class="main-menu">
        <div class="main-menu__content">
          <h1 class="main-menu__title">Personal Idol</h1>
          <h2 class="main-menu__title-sub">Apocalyptic Adventure</h2>
          <nav class="main-menu__nav">
            <button disabled>Continue</button>
            <button onClick={_navigateToMap(this, this.props.uiMessagePort, "map-mountain-caravan")}>New Game</button>
            <button disabled>Load Game</button>
            <button onClick={_optionsOpen(this, this.props.uiMessagePort)}>Options</button>
            <button disabled>Credits</button>
          </nav>
        </div>
      </main>
    );
  }
}
