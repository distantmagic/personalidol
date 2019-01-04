// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import QueryBus from "../framework/classes/QueryBus";
import { default as DialogueQuery } from "../framework/classes/Query/Dialogue";
import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

type Props = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  queryBus: QueryBus
};

type State = {};

export default class DialogueController extends React.Component<Props, State> {
  async componentDidMount() {
    const query = new DialogueQuery(this.props.dialogueResourceReference);

    try {
      const dialogue = await this.props.queryBus.enqueue(
        this.props.cancelToken,
        query
      );
      console.log(dialogue);
    } catch (e) {
      // cancelled
    }
  }

  render() {
    return <div />;
  }
}
