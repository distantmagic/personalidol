import type { Light } from "three/src/lights/Light";

export function castsShadow(light: Light): boolean {
  return Boolean(light.shadow);
}
