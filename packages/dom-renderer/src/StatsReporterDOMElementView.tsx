import { h } from "preact";

import { DOMElementView } from "./DOMElementView";
import { ReplaceableStyleSheet } from "./ReplaceableStyleSheet";

import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { StatsReporterDOMElementView as IStatsReporterDOMElementView } from "./StatsReporterDOMElementView.interface";

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

export class StatsReporterDOMElementView extends DOMElementView implements IStatsReporterDOMElementView {
  public statsCollectorReports: Array<StatsCollectorReport> = [];

  constructor() {
    super();

    this.renderStatCollectorReport = this.renderStatCollectorReport.bind(this);

    this.nameable.name = "StatsReporterDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    super.update(delta, elapsedTime, tickTimerState);

    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    const statsCollectorReports = this.props.statsCollectorReports;

    if (Array.isArray(statsCollectorReports)) {
      this.statsCollectorReports = statsCollectorReports;
    } else {
      this.statsCollectorReports = [];
    }

    this.needsRender = true;
    this.viewLastUpdate = tickTimerState.currentTick;
  }

  render() {
    return (
      <div id="stats">
        {this.statsCollectorReports.map(this.renderStatCollectorReport)}
      </div>
    );
  }

  renderStatCollectorReport(statsCollectorReport: StatsCollectorReport) {
    return (
      <div key={statsCollectorReport.debugName}>
        {statsCollectorReport.debugName}(fps): {Math.round(statsCollectorReport.averageTicks)}
      </div>
    );
  }
}
