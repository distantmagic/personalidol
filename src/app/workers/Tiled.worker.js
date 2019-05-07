import TiledWorker from "../controllers/TiledWorker";
import worker from "../../framework/helpers/worker";

export default worker(function(loggerBreadcrumbs, queryBus) {
  return new TiledWorker(loggerBreadcrumbs, queryBus);
});
