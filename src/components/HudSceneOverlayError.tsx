import * as React from "react";

type Props = {
  children: string;
};

export default function HudSceneOverlayError(props: Props) {
  return <div className="dd__loader dd__loader--error dd__scene__loader">{props.children}</div>;
}
