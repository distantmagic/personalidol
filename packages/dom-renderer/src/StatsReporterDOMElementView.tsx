import { h } from "preact";

import { isStatsReport } from "@personalidol/framework/src/isStatsReport";

import { DOMElementView } from "./DOMElementView";
import { ReplaceableStyleSheet } from "./ReplaceableStyleSheet";

import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { StatsReporterDOMElementView as IStatsReporterDOMElementView } from "./StatsReporterDOMElementView.interface";

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

export class StatsReporterDOMElementView extends DOMElementView implements IStatsReporterDOMElementView {
  public statsReportsFlattened: Array<FlattenedStatsReport> = [];

  constructor() {
    super();

    this.renderStatsReportFlattened = this.renderStatsReportFlattened.bind(this);

    // this.nameable.name = "StatsReporterDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    const statsReports = this.props.statsReports;

    if (Array.isArray(statsReports)) {
      this.statsReportsFlattened = Array.from(_flattenStatsReports(statsReports)).sort(_sortCompareReports);
    } else {
      this.statsReportsFlattened = [];
    }

    this.needsRender = true;
    this.viewLastUpdate = tickTimerState.currentTick;
  }

  render() {
    return (
      <div id="stats">
        {this.statsReportsFlattened.map(this.renderStatsReportFlattened)}
      </div>
    );
  }

  renderStatsReportFlattened([key, value]: FlattenedStatsReport) {
    return (
      <div key={key}>
        {key}: {value}
      </div>
    );
  }
}
