export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  fields: K[],
) => {
  const finalObj: Partial<T> = {};
  for (const key of fields) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};
