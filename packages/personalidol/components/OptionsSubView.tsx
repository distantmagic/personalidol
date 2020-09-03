import { h } from "preact";
import { PureComponent } from "preact/compat";

import { uiDisabledComponentState } from "../src/uiDisabledComponentState";

import type { UIState } from "../src/UIState.type";
import type { UIStateUpdateCallback } from "../src/UIStateUpdateCallback.type";

type Props = {
  domMessagePort: MessagePort;
  uiState: UIState;
  uiStateUpdateCallback: UIStateUpdateCallback;
};

export class OptionsSubView extends PureComponent<Props> {
  _onCanceled = () => {
    this.props.uiState.cOptions = uiDisabledComponentState;
    this.props.uiStateUpdateCallback();
  };

  render() {
    return <pi-options oncanceled={this._onCanceled} />;
  }
}
