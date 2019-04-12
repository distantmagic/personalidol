// @flow

import SceneLifecycle from "./SceneLifecycle";

it("keeps scene state", function() {
  const scene = new SceneLifecycle();

  const promise = new Promise(function(resolve) {
    function listener(evt) {
      scene.off("attaching", listener);
      resolve(evt.to);
    }

    scene.on("attaching", listener);
  });

  scene.attach();

  return expect(promise).resolves.toBe("attaching");
});
