const TEXTURE_EMPTY = "__TB_empty";

export function isEmptyTexturePlaceholder(textureName: string): boolean {
  return textureName === TEXTURE_EMPTY;
}
