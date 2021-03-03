export type Geometry = {
  readonly atlasUVStart: Float32Array;
  readonly atlasUVStop: Float32Array;
  readonly index: Uint32Array;
  readonly normal: Float32Array;
  readonly position: Float32Array;
  readonly transferables: Array<ArrayBuffer>;
  readonly uv: Float32Array;
};
