// @flow

import * as React from "react";

import ModalToolbar from "./ModalToolbar";

type Props = {|
  comment: string,
  label?: string,
|};

export default function ModalLoader(props: Props) {
  return (
    <div className="dd__modal__window dd__frame">
      <ModalToolbar label={props.label} />
      <span className="dd__loader">{props.comment}</span>
    </div>
  );
}
