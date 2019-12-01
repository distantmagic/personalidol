// @flow

import * as React from "react";

type Props = {|
  label: string,
|};

export default function ModalLoader(props: Props) {
  return <span className="dd__loader">{props.label}</span>;
}
