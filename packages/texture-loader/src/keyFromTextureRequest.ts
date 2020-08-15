import type { TextureRequest } from "./TextureRequest.type";

export function keyFromTextureRequest(textureRequest: TextureRequest): string {
  return `${textureRequest.textureUrl} ${String(textureRequest.flipY)}`;
}
