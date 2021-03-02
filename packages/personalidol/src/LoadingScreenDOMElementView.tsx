import { h } from "preact";
import { MathUtils } from "three/src/math/MathUtils";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { UserSettings } from "./UserSettings.type";

export class LoadingScreenDOMElementView extends DOMElementView<UserSettings> {
  static get observedAttributes() {
    return ["comment", "progress"];
  }

  private _progressComment: string = "";
  private _progress: number = 0;
  private _version: number = 0;

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    this.needsRender = true;
    this._version += 1;

    switch (name) {
      case "comment":
        this._progressComment = newValue;
        break;
      case "progress":
        this._progress = parseFloat(newValue);
        break;
    }
  }

  render() {
    if (this._version < 1) {
      return null;
    }

    return (
      <pi-progress-manager-state
        progressManagerState={{
          errors: [],
          expect: 0,
          messages: [
            {
              id: MathUtils.generateUUID(),
              loaded: this._progress,
              total: 1,
              type: this._progressComment,
              uri: "",
            },
          ],
          version: this._version,
        }}
      />
    );
  }
}
