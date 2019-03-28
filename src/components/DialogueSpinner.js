// @flow

import * as React from "react";

type Props = {||};

export default function DialogueSpinner(props: Props) {
  return (
    <div className="dd__dialogue__turn dd__dialogue__turn--loading">
      <img
        alt="Nobody knows anybody"
        className="dd__dialogue__turn__loading-image"
        src="/assets/image-nobody-knows-anybody.png"
      />
    </div>
  );
}
