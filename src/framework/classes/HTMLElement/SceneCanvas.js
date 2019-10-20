// @flow

// import SceneManager from "../SceneManager";

import type { ExceptionHandler } from "../../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { SceneManager as SceneManagerInterface } from "../../interfaces/SceneManager";

export default class SceneCanvas extends HTMLElement {
  canvasElement: HTMLCanvasElement;
  sceneManager: SceneManagerInterface;

  constructor() {
    super();

    // logic

    // this.sceneManager = new SceneManager(
    // );

    // template

    const shadowRoot = this.attachShadow({
      mode: "closed"
    });

    shadowRoot.innerHTML = `
      <style>
        canvas {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
      <canvas id="dm-canvas"></canvas>
    `;

    // $FlowFixMe
    this.canvasElement = shadowRoot.getElementById("dm-canvas");
  }

  connectedCallback() {
    console.log(this.isConnected);
    console.log(this.canvasElement);
    // this.dispatchEvent(new CustomEvent('foo', { 'bar': 'baz' }));
  }

  async attach(loggerBreadcrumbs: LoggerBreadcrumbs, exceptionHandler: ExceptionHandler): Promise<void> {
    console.log(loggerBreadcrumbs, exceptionHandler);
  }
}
