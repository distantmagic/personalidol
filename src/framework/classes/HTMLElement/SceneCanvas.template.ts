// @flow strict

export default function SceneCanvasTemplate(): string {
  return `
    <style>
      #dm-canvas-wrapper {
        height: 100%;
        position: relative;
        width: 100%;
      }
      #dm-canvas-wrapper.dm-canvas-wrapper--loaded #dm-canvas {
        display: block;
      }
      #dm-canvas {
        display: none;
        height: 100%;
        width: 100%;
      }
    </style>
    <div id="dm-canvas-wrapper">
      <canvas id="dm-canvas"></canvas>
    </div>
  `;
}
