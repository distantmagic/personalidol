// @flow

import * as React from "react";

type Props = {};

export default class SuspenseLoader extends React.Component<Props> {
  render() {
    return "Loading suspended component...";
  }
}
