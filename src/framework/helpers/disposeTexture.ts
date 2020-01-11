// @flow strict

import type { Texture } from "three";

export default function disposeTexture(texture: Texture): void {
  return void texture.dispose();
}
