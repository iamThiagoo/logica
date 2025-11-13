export const isObject = (obj: any): boolean => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date);
};
