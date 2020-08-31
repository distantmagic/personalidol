import { h } from "preact";
import { PureComponent } from "preact/compat";

import type { UIState } from "../src/UIState.type";
import type { UIStateUpdateCallback } from "../src/UIStateUpdateCallback.type";

type Props = {
  domMessagePort: MessagePort;
  uiState: UIState;
  uiStateUpdateCallback: UIStateUpdateCallback;
};

function _onSubmit(evt: Event) {
  evt.preventDefault();
}

export class OptionsSubView extends PureComponent<Props> {
  _optionsClose = (evt: Event) => {
    evt.preventDefault();

    delete this.props.uiState.cOptions;

    this.props.uiStateUpdateCallback(this.props.uiState);
  };

  render() {
    return (
      <article class="options">
        <form class="options__form" onSubmit={_onSubmit}>
          <h1>Options</h1>
          <fieldset>
            <legend>Graphics</legend>
          </fieldset>
          <fieldset>
            <legend>Sound</legend>
          </fieldset>
          <footer class="options__buttons">
            <button disabled>OK</button>
            <button onClick={this._optionsClose}>Cancel</button>
            <button disabled>Apply</button>
          </footer>
        </form>
      </article>
    );
  }
}
