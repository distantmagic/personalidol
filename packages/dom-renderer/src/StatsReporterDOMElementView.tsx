import { h } from "preact";

import { isStatsReport } from "@personalidol/framework/src/isStatsReport";

import { ReplaceableStyleSheet } from "./ReplaceableStyleSheet";

import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextState } from "./DOMElementRenderingContextState.type";

type FlattenedStatsReport = [string, number | string];

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #stats {
    color: white;
    display: grid;
    font-family: monospace;
    font-size: 1rem;
    grid-gap: 0.5ch;
    line-height: 1;
    left: 0;
    padding: 1ch;
    position: absolute;
    top: 0;
  }
`;

function* _flattenStatsReport(statsReport: StatsReport, prefix: string = ""): Generator<FlattenedStatsReport> {
  for (let [key, value] of Object.entries(statsReport)) {
    if ("debugName" === key) {
      continue;
    }

    if (isStatsReport(value)) {
      yield* _flattenStatsReport(value, `${prefix}${statsReport.debugName}.`);
      continue;
    }

    yield [
      `${prefix}${statsReport.debugName}.${key}`,
      value,
    ];
  }
}

function* _flattenStatsReports(statsReports: Array<StatsReport>): Generator<FlattenedStatsReport> {
  for (let statsReport of statsReports) {
    yield* _flattenStatsReport(statsReport);
  }
}

function _sortCompareReports(a: FlattenedStatsReport, b: FlattenedStatsReport): number {
  return a[0].localeCompare(b[0]);
}

function _renderStatsReportFlattened([key, value]: FlattenedStatsReport) {
  return (
    <div key={key}>
      {key}: {value}
    </div>
  );
}

export function StatsReporterDOMElementView(
  id: string,
  shadow: ShadowRoot
): DOMElementRenderingContext {
  const name: string = "StatsReporterDOMElementView";
  const state: DOMElementRenderingContextState = Object.seal({
    needsRender: false,
    styleSheet: ReplaceableStyleSheet(shadow, _css, name),
  });

  let _statsReportsFlattened: Array<FlattenedStatsReport> = [];

  function beforeRender(props: DOMElementProps, propsLastUpdate: number, viewLastUpdate: number) {
    const statsReports = props.statsReports;

    if (Array.isArray(statsReports)) {
      _statsReportsFlattened = Array.from(_flattenStatsReports(statsReports)).sort(_sortCompareReports);
      state.needsRender = true;
    } else {
      state.needsRender = 0 !== _statsReportsFlattened.length;
      _statsReportsFlattened = [];
    }
  }

  function render() {
    return (
      <div id="stats">
        {_statsReportsFlattened.map(_renderStatsReportFlattened)}
      </div>
    );
  }

  return Object.freeze({
    id: id,
    isPure: true,
    name: name,
    state: state,

    beforeRender: beforeRender,
    render: render,
  });
}
