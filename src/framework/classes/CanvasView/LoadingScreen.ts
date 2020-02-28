import * as THREE from "three";
import autoBind from "auto-bind";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";
import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

const ROTATION_SPEED = 1;

export default class LoadingScreen extends CanvasView {
  private progress: number = 0;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group) {
    super(loggerBreadcrumbs, canvasViewBag, group);
    autoBind(this);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const ambientLight = new THREE.AmbientLight( 0x404040 );

    this.children.add( ambientLight );

    const spriteMap = new THREE.TextureLoader().load( 'images/personalidol-256x256.png' );
    const spriteMaterial = new THREE.SpriteMaterial( {
      map: spriteMap,
      color: 0xffffff
    } );
    const sprite = new THREE.Sprite( spriteMaterial );

    sprite.scale.set(1, 1, 1)
    this.children.add( sprite );
  }

  getName(): "LoadingScreen" {
    return "LoadingScreen";
  }

  setProgress(progress: number): void {
    this.progress = progress;
  }

  update(delta: number): void {
    this.children.rotation.x += ROTATION_SPEED * delta;
    this.children.rotation.y += ROTATION_SPEED * delta;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
