const prettify = (s: string): string => s.replace(/_/g, " ").replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
const ratio = (n1: number, n2: number) => isFinite(n1 / n2) ? (+(n1 / n2)).toFixed(2) : n1 == 0 && n2 == 0 ? (0).toFixed(2) : n1.toFixed(2);

const object = <T>(object: T | undefined, keys: string[]) => {
    let current = object;
    keys.forEach(key => current = (current || {})[key]);
    return current;
};

const handleValue = (value: any, options: IValueOpts = { markdown: true }) => {
    if (options.blank) return "\u200b";
    if (options.markdown) {
        if ([NaN, undefined, null].includes(value)) value = 0;
        if (typeof value === 'number') {
            if (!Number.isInteger(value)) value = value.toFixed(2);
            else value = value.toLocaleString();
        }
    }

    return value;
};

const chunk = (arr: any[], size: number) => arr.slice(0, (arr.length + size - 1) / size | 0).map((_, i) => arr.slice(size * i, size * i + size));

export {
    prettify,
    ratio,
    object,
    handleValue,
    chunk
};

interface IValueOpts {
    markdown: boolean,
    blank?: boolean;
}