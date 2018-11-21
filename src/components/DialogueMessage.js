// @flow

import React from "react";

import { default as DialogueMessageModel } from "../domain/DialogueMessage";

type Props = {
  message: DialogueMessageModel
};

export default class DialogueMessage extends React.Component<Props> {
  render() {
    console.log(this.props.message);
    return <li>{this.props.message.label()}</li>;
  }
}
