export type EntityFuncGroup = {
  readonly classname: "func_group";
  // readonly indices: ArrayBuffer;
  readonly normals: ArrayBuffer;
  readonly textureNames: ReadonlyArray<string>;
  readonly textures: ArrayBuffer;
  readonly transferables: ReadonlyArray<ArrayBuffer>;
  readonly uvs: ArrayBuffer;
  readonly vertices: ArrayBuffer;
};
