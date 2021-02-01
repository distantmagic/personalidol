import { MathUtils } from "three/src/math/MathUtils";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { StatsHook } from "./StatsHook.interface";
import type { WebGLRendererStatsReport } from "./WebGLRendererStatsReport.type";

// const memory: any = (performance as any).memory;

export function WebGLRendererStatsHook(debugName: string, renderer: WebGLRenderer): StatsHook {
  const statsReport: WebGLRendererStatsReport = {
    debugName: debugName,
    memoryGeometries: 0,
    memoryTextures: 0,
    programs: 0,
    renderCalls: 0,
    renderFrame: 0,
    renderLines: 0,
    renderPoints: 0,
    renderTriangles: 0,
  };

  function reset(): void {}

  function update(delta: number): void {
    statsReport.memoryGeometries = renderer.info.memory.geometries;
    statsReport.memoryTextures = renderer.info.memory.textures;
    statsReport.programs = renderer.info.programs?.length ?? 0;
    statsReport.renderCalls = renderer.info.render.calls;
    statsReport.renderFrame = renderer.info.render.frame;
    statsReport.renderLines = renderer.info.render.lines;
    statsReport.renderPoints = renderer.info.render.points;
    statsReport.renderTriangles = renderer.info.render.triangles;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isWebGLRendererStatsHook: true,
    isStatsHook: true,
    name: `WebGLRendererStatsHook("${debugName}")`,
    statsReport: statsReport,

    reset: reset,
    update: update,
  });
}
