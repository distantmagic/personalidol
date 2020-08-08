import { Exception } from "./Exception";

export class UnmarshalException extends Exception {
  constructor(filename: string, line: number, message: string) {
    super(`${filename}:${line} - ${message}`);
  }
}
