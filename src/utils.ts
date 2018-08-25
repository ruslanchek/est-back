export class Utils {
  static removeDoubleSlashes(input: string): string {
    return input.replace(/([^:]\/)\/+/g, '$1');
  }

  static parseId(value: any): number {
    const parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
      return 0;
    }

    return parsed;
  }
}