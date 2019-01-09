// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import DialogueController from "./DialogueController";
import QueryBus from "../framework/classes/QueryBus";
import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

type Props = {};

type State = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  error: ?Error,
  queryBus: QueryBus
};

export default class Main extends React.Component<Props, State> {
  queryBusInterval: IntervalID;

  constructor(props: Props) {
    super(props);

    this.state = {
      cancelToken: new CancelToken(),
      dialogueResourceReference: new DialogueResourceReference("1"),
      error: null,
      queryBus: new QueryBus()
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
