
export function safeParse(text: string): any {
    if (!text || text.trim() === '') return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return undefined; // Invalid JSON
    }
}

export interface CanonicalizeOptions {
    ignoreArrayOrder: boolean;
}

export function canonicalize(data: any, options: CanonicalizeOptions): any {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    if (Array.isArray(data)) {
        const next = data.map((item) => canonicalize(item, options));
        if (options.ignoreArrayOrder) {
            // Sort arrays to treat as sets.
            // We use JSON.stringify as a sturdy hash for sorting.
            next.sort((a, b) => {
                const sa = JSON.stringify(a);
                const sb = JSON.stringify(b);
                return sa.localeCompare(sb);
            });
        }
        return next;
    }

    // Object: Sort keys recursively
    const keys = Object.keys(data).sort();
    const next: any = {};
    for (const key of keys) {
        next[key] = canonicalize(data[key], options);
    }
    return next;
}
