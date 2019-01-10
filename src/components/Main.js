// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import DialogueController from "./DialogueController";
import ExpressionGlobalContext from "../framework/classes/ExpressionGlobalContext";
import QueryBus from "../framework/classes/QueryBus";
import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

type Props = {};

type State = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  expressionGlobalContext: ExpressionGlobalContext,
  error: ?Error,
  queryBus: QueryBus
};

export default class Main extends React.Component<Props, State> {
  queryBusInterval: IntervalID;

  constructor(props: Props) {
    super(props);

    const queryBus = new QueryBus();

    this.state = {
      cancelToken: new CancelToken(),
      dialogueResourceReference: new DialogueResourceReference(
        "data/dialogues/umbrux-intro.yml"
      ),
      expressionGlobalContext: new ExpressionGlobalContext(queryBus),
      error: null,
      queryBus: queryBus
    };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  componentDidMount() {
    this.queryBusInterval = setInterval(() => {
      this.state.queryBus.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.queryBusInterval);
    this.state.cancelToken.cancel();
  }

  render() {
    return (
      <div>
        <DialogueController
          cancelToken={this.state.cancelToken}
          dialogueResourceReference={this.state.dialogueResourceReference}
          queryBus={this.state.queryBus}
        />
        <DialogueController
          cancelToken={this.state.cancelToken}
          dialogueResourceReference={this.state.dialogueResourceReference}
          queryBus={this.state.queryBus}
        />
        <DialogueController
          cancelToken={this.state.cancelToken}
          dialogueResourceReference={this.state.dialogueResourceReference}
          queryBus={this.state.queryBus}
        />
      </div>
    );
  }
}
