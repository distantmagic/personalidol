// @flow

import SceneLifecycle from "./SceneLifecycle";

it("keeps scene state", function() {
  const scene = new SceneLifecycle();

  const promise = new Promise(function(resolve) {
    scene.events.on("attaching", function(evt) {
      resolve(evt.to);
    });
  });

  scene.attach();

  return expect(promise).resolves.toBe("attaching");
});
