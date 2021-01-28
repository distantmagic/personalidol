import { Fragment, h } from "preact";

import { DOMElementView } from "./DOMElementView";
import { ReplaceableStyleSheet } from "./ReplaceableStyleSheet";

import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";
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
  public statsReports: Array<StatsReport> = [];

  constructor() {
    super();

    this.renderStatHookReport = this.renderStatHookReport.bind(this);

    this.nameable.name = "StatsReporterDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    const statsReports = this.props.statsReports;

    if (Array.isArray(statsReports)) {
      this.statsReports = statsReports;
    } else {
      this.statsReports = [];
    }

    this.needsRender = true;
    this.viewLastUpdate = tickTimerState.currentTick;
  }

  render() {
    return (
      <div id="stats">
        {this.statsReports.map(this.renderStatHookReport)}
      </div>
    );
  }

  renderStatHookReport(statsReport: StatsReport) {
    return (
      <Fragment>
        {Object.entries(statsReport).map(function ([entry, value]) {
          return (
            <div key={statsReport.debugName}>
              {statsReport.debugName}({entry}): {value}
            </div>
          );
        })}
      </Fragment>
    );
  }
}
