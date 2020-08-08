import type { Camera, WebGLRenderer, Scene } from "three";

export type RendererState = {
  camera: null | Camera;
  renderer: WebGLRenderer;
  scene: null | Scene;
};
