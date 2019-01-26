// @flow

import * as React from "react";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import Person from "../framework/classes/Entity/Person";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger
|};

type State = {|
  cancelToken: CancelToken,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  error: ?Error,
  queryBus: QueryBusInterface,
  queryBusController: QueryBusController
|};

export default class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const queryBus = new QueryBus();

    this.state = {
      cancelToken: new CancelToken(),
      expressionBus: new ExpressionBus(),
      expressionContext: new ExpressionContext(),
      error: null,
      queryBus: queryBus,
      queryBusController: new QueryBusController(new BusClock(), queryBus)
    };
  }

  componentDidCatch(error: Error, errorInfo: Object): void {
    this.setState({
      error: error
    });
  }

  componentDidMount(): void {
    this.state.queryBusController.interval(this.state.cancelToken);
  }

  componentWillUnmount(): void {
    this.state.cancelToken.cancel();
  }

  render() {
    return (
      <DialogueLoader
        dialogueResourceReference={
          new DialogueResourceReference("/data/dialogues/umbrux-intro.yml")
        }
        dialogueInitiator={new Person("Laelaps")}
        expressionBus={this.state.expressionBus}
        expressionContext={this.state.expressionContext}
        logger={this.props.logger}
        queryBus={this.state.queryBus}
      />
    );
  }
}
