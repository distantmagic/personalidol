export type QuakeWorkerWorldspawn = {
  readonly classname: "worldspawn";
  readonly indices: ArrayBuffer;
  readonly normals: ArrayBuffer;
  readonly texturesIndices: ArrayBuffer;
  readonly texturesNames: ReadonlyArray<string>;
  readonly uvs: ArrayBuffer;
  readonly vertices: ArrayBuffer;
};
