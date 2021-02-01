import type { StatsReport } from "./StatsReport.type";

export type WebGLRendererStatsReport = StatsReport & {
  memoryGeometries: number;
  memoryTextures: number;
  programs: number;
  renderCalls: number;
  renderFrame: number;
  renderLines: number;
  renderPoints: number;
  renderTriangles: number;
};
