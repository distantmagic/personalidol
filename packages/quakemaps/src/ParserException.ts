export class ParserException extends Error {
  constructor(filename: string, line: number, message: string) {
    super(`${filename}:${line} - ${message}`);
  }
}
