export type StatsReport = {
  [key: string]: number | string | StatsReport;
} & {
  debugName: string;
};
