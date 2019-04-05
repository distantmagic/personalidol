// @flow

import * as React from "react";

import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HudSceneManager from "./HudSceneManager";
// import HudSceneLocationRoom from "./HudSceneLocationRoom";
import SceneManager from "../framework/classes/SceneManager";

import type { MainLoop } from "../framework/interfaces/MainLoop";

type Props = {|
  mainLoop: MainLoop
|};

export default function HudScene(props: Props) {
  // return (
  //   <HudSceneLocationRoom />
  // );
  return (
    <HudSceneManager
      sceneManager={
        new SceneManager(props.mainLoop, new CanvasLocationComplex())
      }
    />
  );
}
