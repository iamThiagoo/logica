export const convertToNumber = (value: string | number | null): number | null | string => {
  if (value && typeof value !== 'number') return parseInt(value, 10);
  return value;
};

export const convertToString = (value: string | number | null): string | null | number => {
  if (value && typeof value !== 'string') return String(value);
  return value;
};

export const convertToFloat = (value: string | number | null): number | null | string => {
  if (value && typeof value !== 'number') return parseFloat(value);
  return value;
};

export function convertSizeToBytes(sizeString: string): number {
  const [valueStr, unit] = sizeString.split(' ');
  const value = parseFloat(valueStr);

  switch (unit) {
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 * 1024;
    case 'GB':
      return value * 1024 * 1024 * 1024;
    case 'TB':
      return value * 1024 * 1024 * 1024 * 1024;
    default:
      return value;
  }
}

export function bytesFormat(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
