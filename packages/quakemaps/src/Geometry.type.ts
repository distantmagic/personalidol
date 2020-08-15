export type Geometry = {
  readonly atlasUVStart: Float32Array;
  readonly atlasUVStop: Float32Array;
  readonly indices: Uint32Array;
  readonly normals: Float32Array;
  readonly transferables: ReadonlyArray<ArrayBuffer>;
  readonly uvs: Float32Array;
  readonly vertices: Float32Array;
};
