export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export const is2DArray = (value: unknown): value is unknown[][] => {
  return Array.isArray(value) && value.every(Array.isArray);
};
