export function parseInteger({ value }: any): number | any {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();
        if (/^-?\d+$/.test(trimmedValue)) {
            return parseInt(trimmedValue, 10);
        }
    }
    return value;
}