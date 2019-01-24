// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import Logger from "../framework/classes/Logger";
import QueryBus from "../framework/classes/QueryBus";

import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {};

type State = {
  cancelToken: CancelToken,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  error: ?Error,
  logger: Logger,
  queryBus: QueryBusInterface
};

export default class Main extends React.Component<Props, State> {
  queryBusInterval: IntervalID;

  constructor(props: Props) {
    super(props);

    this.state = {
      cancelToken: new CancelToken(),
      expressionBus: new ExpressionBus(),
      expressionContext: new ExpressionContext(),
      error: null,
      logger: new Logger(),
      queryBus: new QueryBus()
    };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  componentDidMount() {
    this.queryBusInterval = setInterval(async () => {
      this.setState({
        queryBus: await this.state.queryBus.tick()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.queryBusInterval);
    this.state.cancelToken.cancel();
  }

  render() {
    return <div />;
  }
}
