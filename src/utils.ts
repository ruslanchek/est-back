export class Utils {
  static removeDoubleSlashes(input: string): string {
    return input.replace(/([^:]\/)\/+/g, '$1');
  }
}