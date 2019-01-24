// @flow

import * as React from "react";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import Logger from "../framework/classes/Logger";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {};

type State = {
  cancelToken: CancelToken,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  error: ?Error,
  logger: Logger,
  queryBus: QueryBusInterface,
  queryBusController: QueryBusController
};

export default class Main extends React.Component<Props, State> {
  queryBusInterval: IntervalID;

  constructor(props: Props) {
    super(props);

    const queryBus = new QueryBus();

    this.state = {
      cancelToken: new CancelToken(),
      expressionBus: new ExpressionBus(),
      expressionContext: new ExpressionContext(),
      error: null,
      logger: new Logger(),
      queryBus: queryBus,
      queryBusController: new QueryBusController(new BusClock(), queryBus)
    };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  componentDidMount() {
    this.state.queryBusController.interval(this.state.cancelToken);
  }

  componentWillUnmount() {
    this.state.cancelToken.cancel();
  }

  render() {
    return <div />;
  }
}
