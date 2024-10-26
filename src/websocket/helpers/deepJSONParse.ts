export function deepJSONParse<T>(obj: T): T {
    if (typeof obj === 'string') {
      try {
        const parsed = JSON.parse(obj);
        return deepJSONParse(parsed);
      } catch {
        return obj;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj).map(([key, value]) => [key, deepJSONParse(value)]);
      return Object.fromEntries(entries) as T;
    }
    return obj;
  }