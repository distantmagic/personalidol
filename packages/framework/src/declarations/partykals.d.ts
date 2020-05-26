declare module "partykals/partykals" {
  import * as THREE from "three";

  export class ColorsRandomizer {
    constructor(color0: THREE.Color, color1: THREE.Color);
  }

  export class Emitter {
    constructor(options: { onInterval: MinMaxRandomizer; interval: MinMaxRandomizer });
  }

  export class MinMaxRandomizer {
    constructor(min: number, max: number);
  }

  export class ParticlesSystem {
    constructor(options: {
      container: THREE.Object3D;
      particles: {
        blending: "additive" | "blend" | "opaque";
        colorize: boolean;
        endAlpha: number;
        endColor: THREE.Color;
        endSize: number;
        startAlpha: number;
        startColor: ColorsRandomizer;
        startSize: number;
        ttl: number;
        velocity: SphereRandomizer;
        velocityBonus: THREE.Vector3;
        worldPosition: boolean;
      };
      system: {
        depthWrite: boolean;
        emitters: Emitter;
        particlesCount: number;
        scale: number;
        speed: number;
      };
    });
  }

  export class SphereRandomizer {
    constructor(options: {});
  }

  export var Randomizers: {
    ColorsRandomizer: typeof ColorsRandomizer;
    MinMaxRandomizer: typeof MinMaxRandomizer;
    SphereRandomizer: typeof SphereRandomizer;
  };
}
