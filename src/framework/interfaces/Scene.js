// @flow

import CancelToken from "../classes/CancelToken";

import type { SceneState } from "./SceneState";

export interface Scene {
  awaitStateUpdate(cancelToken: CancelToken): Promise<SceneState>;

  awaitStateUpdates(
    cancelToken: CancelToken
  ): AsyncGenerator<SceneState, void, void>;
}
