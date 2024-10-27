export function deepJSONStringify<T>(obj: T): string {
    if (typeof obj === 'string') {
        return JSON.stringify(obj);
    } else if (Array.isArray(obj)) {
        return JSON.stringify(obj.map(item => deepJSONStringify(item)));
    } else if (typeof obj === 'object' && obj !== null) {
        const entries = Object.entries(obj).map(([key, value]) => [key, deepJSONStringify(value)]);
        return JSON.stringify(Object.fromEntries(entries));
    }
    return JSON.stringify(obj);
}