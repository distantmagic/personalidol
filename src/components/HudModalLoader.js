// @flow

import * as React from "react";

type Props = {|
  label: string
|};

export default function HudModalLoader(props: Props) {
  return (
    <span aria-label="Loading..." className="dd__loader">
      {props.label}
    </span>
  );
}
