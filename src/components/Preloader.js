// @flow

import * as React from "react";

type Props = {|
  children?: React.Node,
  message: string,
|};

export default function Preloader(props: Props) {
  return (
    <div className="dd__setup">
      <p>{props.message}</p>
      {props.children}
    </div>
  );
}
