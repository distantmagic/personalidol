// @flow

import React from "react";

type Props = {};

type State = {
  error: ?Error
};

export default class Main extends React.Component<Props, State> {
  state = {
    error: null
  };

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  render() {
    return null;
  }
}
