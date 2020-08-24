import { h } from "preact";
import { PureComponent } from "preact/compat";

import { uiOptionsClose } from "../src/uiOptionsClose";

type Props = {
  uiMessagePort: MessagePort;
};

function _onSubmit(self: OptionsScreen) {
  return function (evt: Event) {
    evt.preventDefault();
  };
}

function _optionsClose(self: OptionsScreen, uiMessagePort: MessagePort) {
  return function () {
    uiOptionsClose(uiMessagePort);
  };
}

export class OptionsScreen extends PureComponent<Props> {
  render() {
    const _close = _optionsClose(this, this.props.uiMessagePort);

    return (
      <article class="options">
        <form class="options__form" onSubmit={_onSubmit(this)}>
          <h1>Options</h1>
          <fieldset>
            <legend>Graphics</legend>
          </fieldset>
          <fieldset>
            <legend>Sound</legend>
          </fieldset>
          <footer class="options__buttons">
            <button disabled>OK</button>
            <button onClick={_close}>Cancel</button>
            <button disabled>Apply</button>
          </footer>
        </form>
      </article>
    );
  }
}
