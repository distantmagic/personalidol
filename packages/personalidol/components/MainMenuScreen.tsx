import { h } from "preact";
import { PureComponent } from "preact/compat";

import { uiNavigateToMap } from "../src/uiNavigateToMap";

type Props = {
  uiMessagePort: MessagePort;
};

function navigateToMap(self: MainMenuScreen, uiMessagePort: MessagePort, filename: string) {
  return function () {
    uiNavigateToMap(uiMessagePort, filename);
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
            <button onClick={navigateToMap(this, this.props.uiMessagePort, "/maps/map-mountain-caravan.map")}>New Game</button>
            <button disabled>Load Game</button>
            <button disabled>Options</button>
            <button disabled>Credits</button>
          </nav>
        </div>
      </main>
    );
  }
}
