export type GeometryAttributes = {
  atlasUVStart: Float32Array;
  atlasUVStop: Float32Array;
  indices: Uint32Array;
  normals: Float32Array;
  uvs: Float32Array;
  vertices: Float32Array;
  transferables: [ArrayBuffer, ArrayBuffer, ArrayBuffer, ArrayBuffer, ArrayBuffer, ArrayBuffer];
};
