import { Fragment, h } from "preact";

import { DOMElementView } from "./DOMElementView";
import { ReplaceableStyleSheet } from "./ReplaceableStyleSheet";

import type { StatsHookReportMessage } from "@personalidol/framework/src/StatsHookReportMessage.type";
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
  public statsHookReports: Array<StatsHookReportMessage> = [];

  constructor() {
    super();

    this.renderStatHookReport = this.renderStatHookReport.bind(this);

    this.nameable.name = "StatsReporterDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    super.update(delta, elapsedTime, tickTimerState);

    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    const statsHookReports = this.props.statsHookReports;

    if (Array.isArray(statsHookReports)) {
      this.statsHookReports = statsHookReports;
    } else {
      this.statsHookReports = [];
    }

    this.needsRender = true;
    this.viewLastUpdate = tickTimerState.currentTick;
  }

  render() {
    return (
      <div id="stats">
        {this.statsHookReports.map(this.renderStatHookReport)}
      </div>
    );
  }

  renderStatHookReport(statsHookReport: StatsHookReportMessage) {
    return (
      <Fragment>
        {Object.entries(statsHookReport).map(function ([entry, value]) {
          return (
            <div key={statsHookReport.debugName}>
              {statsHookReport.debugName}({entry}): {value}
            </div>
          );
        })}
      </Fragment>
    );
  }
}
