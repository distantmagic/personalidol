import * as THREE from "three";
import autoBind from "auto-bind";
import Partykals from "partykals/partykals";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type QuakeWorkerSparkParticles from "src/framework/types/QuakeWorkerSparkParticles";

export default class Particles extends CanvasView {
  private system: any;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerSparkParticles) {
    super(loggerBreadcrumbs, canvasViewBag, group);
    autoBind(this);

    this.children.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.system = new Partykals.ParticlesSystem({
      container: this.children,
      particles: {
        startAlpha: 1,
        endAlpha: 0,
        startSize: 3.5,
        endSize: 10,
        ttl: 3,
        velocity: new Partykals.Randomizers.SphereRandomizer(5),
        velocityBonus: new THREE.Vector3(0, 10, 0),
        colorize: true,
        startColor: new Partykals.Randomizers.ColorsRandomizer(new THREE.Color(0.5, 0.2, 0), new THREE.Color(1, 0.5, 0)),
        endColor: new THREE.Color(0, 0, 0),
        blending: "additive",
        worldPosition: true,
      },
      system: {
        particlesCount: 100,
        scale: 400,
        emitters: new Partykals.Emitter({
          onInterval: new Partykals.Randomizers.MinMaxRandomizer(0, 5),
          interval: new Partykals.Randomizers.MinMaxRandomizer(0, 0.25),
        }),
        depthWrite: false,
        speed: 1,
      },
    });
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.system.dispose();
  }

  getName(): "Particles" {
    return "Particles";
  }

  isInFrustum(frustum: THREE.Frustum): boolean {
    return frustum.containsPoint(this.children.position);
  }

  update(delta: number): void {
    if (!this.isInCameraFrustum()) {
      return;
    }

    this.system.update(delta);
  }

  useCameraFrustum(): true {
    return true;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
