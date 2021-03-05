export function unary<T, U>(fn: (arg: T) => U): (arg: T) => U {
  return function (arg: T): U {
    return fn(arg);
  };
}
