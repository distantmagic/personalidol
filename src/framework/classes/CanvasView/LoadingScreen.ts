import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default class LoadingScreen extends CanvasView {
  private accumulatedDelta: number = 0;
  private progress: number = 0;

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

  getName(): "LoadingScreen" {
    return "LoadingScreen";
  }

  setProgress(progress: number): void {
    this.progress = progress;
  }

  update(delta: number): void {
    this.accumulatedDelta += delta;

    const scale = 0.9 + 0.05 * Math.sin(this.accumulatedDelta);

    this.children.scale.set(scale, scale, 1);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
