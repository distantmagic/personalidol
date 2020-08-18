import type { Pass } from "./Pass.interface";

export interface EffectComposer {
  addPass(pass: Pass): void;

  removePass(pass: Pass): void;

  render(deltaTime: null | number): void;

  setSize(width: number, height: number): void;
}
