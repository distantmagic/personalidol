// @flow

import * as React from "react";

import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HudSceneManager from "./HudSceneManager";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";
import SceneManager from "../framework/classes/SceneManager";

type Props = {||};

export default function HudScene(props: Props) {
  // return (
  //   <HudSceneLocationRoom />
  // );
  return (
    <HudSceneManager
      sceneManager={new SceneManager(new CanvasLocationComplex())}
    />
  );
}
