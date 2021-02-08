export type StatsReport = {
  [key: string]: boolean | number | string | StatsReport;
} & {
  debugName: string;
  lastUpdate: number;
};
