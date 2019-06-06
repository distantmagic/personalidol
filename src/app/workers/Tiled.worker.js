import TiledWorker from "./Tiled";
import worker from "../../framework/helpers/worker";

export default worker(function(loggerBreadcrumbs, queryBus) {
  return new TiledWorker(loggerBreadcrumbs, queryBus);
});
