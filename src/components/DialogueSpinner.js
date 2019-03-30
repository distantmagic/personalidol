// @flow

import * as React from "react";

type Props = {||};

export default function DialogueSpinner(props: Props) {
  return (
    <div className="dd__dialogue__turn dd__dialogue__turn--loading">
      <div className="dd__spinner__gears" />
    </div>
  );
}
