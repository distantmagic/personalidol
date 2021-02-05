import type { MD2LoaderMorphNormal } from "./MD2LoaderMorphNormal.type";
import type { MD2LoaderMorphPosition } from "./MD2LoaderMorphPosition.type";
import type { MD2LoaderParsedGeometryFrame } from "./MD2LoaderParsedGeometryFrame.type";

export type MD2LoaderParsedGeometry = {
  boundingBoxes: {
    stand: {
      min: {
        x: number;
        y: number;
        z: number;
      };
      max: {
        x: number;
        y: number;
        z: number;
      };
    };
  };
  frames: Array<MD2LoaderParsedGeometryFrame>;
  morphNormals: Array<MD2LoaderMorphNormal>;
  morphPositions: Array<MD2LoaderMorphPosition>;
  normals: Float32Array;
  uvs: Float32Array;
  vertices: Float32Array;

  transferables: Array<Transferable>;
};
