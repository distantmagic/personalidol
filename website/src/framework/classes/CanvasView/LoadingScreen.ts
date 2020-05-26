import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default class LoadingScreen extends CanvasView {
  private accumulatedDelta: number = 0;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group) {
    super(loggerBreadcrumbs, canvasViewBag, group);
    autoBind(this);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const ambientLight = new THREE.AmbientLight(0x404040);

    this.children.add(ambientLight);

    const spriteMap = new THREE.TextureLoader().load("images/personalidol-256x256.png");
    const spriteMaterial = new THREE.SpriteMaterial({
      map: spriteMap,
      color: 0xffffff,
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    this.children.add(sprite);
  }

  setProgress(progress: number): void {}

  update(delta: number): void {
    this.accumulatedDelta += delta;

    const scale = 0.9 + 0.05 * Math.sin(this.accumulatedDelta);

    this.children.scale.set(scale, scale, 1);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
