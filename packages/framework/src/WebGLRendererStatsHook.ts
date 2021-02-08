import { MathUtils } from "three/src/math/MathUtils";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { StatsHook } from "./StatsHook.interface";
import type { WebGLRendererStatsReport } from "./WebGLRendererStatsReport.type";

const DEBUG_NAME: "renderer_webgl" = "renderer_webgl";

export function WebGLRendererStatsHook(renderer: WebGLRenderer): StatsHook {
  const statsReport: WebGLRendererStatsReport = {
    debugName: DEBUG_NAME,
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
    name: `WebGLRendererStatsHook("${DEBUG_NAME}")`,
    statsReport: statsReport,
    statsReportIntervalSeconds: 0,

    reset: reset,
    update: update,
  });
}
