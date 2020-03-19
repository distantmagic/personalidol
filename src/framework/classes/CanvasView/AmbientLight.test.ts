import * as THREE from "three";

import di from "src/framework/helpers/di";

import AmbientLight from "src/framework/classes/CanvasView/AmbientLight";

import QuakeWorkerLightAmbient from "src/framework/types/QuakeWorkerLightAmbient";

test("is cleanly attached and disposed", async function() {
  const loggerBreadcrumbs = di.reuse("loggerBreadcrumbs");
  const cancelToken = di.reuse("cancelToken");
  const canvasViewBag = di.reuse("canvasViewBag", {
    camera: new THREE.PerspectiveCamera(),
  });
  const group = new THREE.Group();
  const entity: QuakeWorkerLightAmbient = {
    classname: "light_ambient",
    light: 0.3,
  };

  const ambientLight = new AmbientLight(loggerBreadcrumbs, canvasViewBag, group, entity);

  expect(ambientLight.getChildren().children).toHaveLength(0);

  await ambientLight.attach(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(1);

  await ambientLight.dispose(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(0);
});
