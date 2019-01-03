// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import QueryBus from "../framework/classes/QueryBus";

import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

type Props = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  queryBus: QueryBus
};

type State = {};

export default class DialogueController extends React.Component<Props, State> {
  render() {
    return <div />;
  }
}
