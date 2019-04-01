// @flow

import * as React from "react";

type Props = {|
  label: string
|};

export default function DialogueSpinner(props: Props) {
  return (
    <div className="dd__dialogue dd__dialogue--loading dd__dialogue--hud dd__frame">
      <div className="dd__dialogue__turn dd__dialogue__turn--loading dd__loader">
        {props.label}
      </div>
    </div>
  );
}
