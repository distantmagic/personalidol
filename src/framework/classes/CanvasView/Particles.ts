import * as THREE from "three";
import autoBind from "auto-bind";

// @ts-ignore
import Partykals from "partykals/partykals";

import CanvasView from "src/framework/classes/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { QuakeWorkerSparkParticles } from "src/framework/types/QuakeWorkerSparkParticles";

export default class Particles extends CanvasView {
  readonly group: THREE.Group;
  readonly origin: THREE.Vector3;
  private system: any;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerSparkParticles) {
    super(canvasViewBag);
    autoBind(this);

    this.origin = new THREE.Vector3(entity.origin[0], entity.origin[1], entity.origin[2]);
    this.group = group;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const container = new THREE.Object3D();

    container.position.copy(this.origin);

    this.system = new Partykals.ParticlesSystem({
      container: container,
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
        speed: 0.001,
      },
    });

    this.group.add(container);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.system.dispose();
  }

  update(delta: number): void {
    super.update(delta);

    this.system.update(delta);
  }

  useUpdate(): boolean {
    return true;
  }
}
