// @flow

import * as React from "react";

import HudSceneLocationComplex from "./HudSceneLocationComplex";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";

type Props = {||};

type State = {||};

export default class HudScene extends React.Component<Props, State> {
  // constructor(props: Props) {
  // super(props);
  // pass scene manager via props
  // this.sceneManager = new SceneManager(new CanvasLocationComplex());
  // }

  render() {
    return <HudSceneLocationComplex />;
    // return <HudSceneLocationRoom />;
  }
}
