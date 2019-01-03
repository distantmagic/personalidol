// @flow

import * as React from "react";

import DialogueButton from "./DialogueButton";
import { default as DialogueModel } from "../framework/classes/Dialogue";

type Props = {};

type State = {};

export default class Dialogue extends React.Component<Props, State> {
  render() {
    return <div />;
  }
}

// <div>
//   {this.props.dialogue.prompt()}
//   <ol>
//     {this.props.dialogue.buttons().map(button => (
//       <li key={button.label()}>
//         <DialogueButton button={button} />
//       </li>
//     ))}
//   </ol>
// </div>
