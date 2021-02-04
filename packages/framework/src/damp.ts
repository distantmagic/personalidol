import { MathUtils } from "three/src/math/MathUtils";

let _damped: number = 0;

export function damp( x : number, y : number, lambda : number, dt : number ) : number {
  if (x === y) {
    return x;
  }

  _damped = MathUtils.damp(x, y, lambda, dt);

  if (Math.abs(_damped - y) < 0.1) {
    // Close enough, avoid possible redraws unnoticable to the user.
    return y;
  }

  return _damped;
}
