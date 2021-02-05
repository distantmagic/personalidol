import type { MD2GeometryParts } from "./MD2GeometryParts.type";
import type { MD2LoaderParsedGeometry } from "./MD2LoaderParsedGeometry.type";

export type MD2LoaderParsedGeometryWithParts = MD2LoaderParsedGeometry & {
  parts: MD2GeometryParts;
};
