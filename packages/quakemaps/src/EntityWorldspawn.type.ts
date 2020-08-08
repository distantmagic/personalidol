export type EntityWorldspawn = {
  readonly classname: "worldspawn";
  readonly indices: Uint32Array;
  readonly normals: Float32Array;
  readonly textureNames: ReadonlyArray<string>;
  readonly textures: Float32Array;
  readonly transferables: ReadonlyArray<ArrayBuffer>;
  readonly uvs: Float32Array;
  readonly vertices: Float32Array;
};
