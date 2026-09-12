export function pick<T, K extends keyof T, M extends object>(
  obj: T,
  keys: K[],
  merge?: M,
): Pick<T, K> & M {
  const picked = keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );

  return {
    ...picked,
    ...merge,
  } as Pick<T, K> & M;
}
