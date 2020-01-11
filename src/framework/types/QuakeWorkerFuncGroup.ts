export type QuakeWorkerFuncGroup = {
  readonly classname: "func_group";
  readonly indices: ArrayBuffer;
  readonly normals: ArrayBuffer;
  readonly texturesIndices: ArrayBuffer;
  readonly texturesNames: ReadonlyArray<string>;
  readonly uvs: ArrayBuffer;
  readonly vertices: ArrayBuffer;
};
