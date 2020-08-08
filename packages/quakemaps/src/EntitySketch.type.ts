import type { Brush } from "./Brush.type";

export type EntitySketch = {
  brushes: Brush[];
  properties: {
    [key: string]: string;
  };
};
