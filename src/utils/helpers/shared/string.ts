export const removeCharacter = (value: string, name?: string) => {
  if (value && typeof value === 'string') {
    value = value.split(/[^0-9]+/).join('');
    if (name === 'fn' && value.startsWith('0')) {
      value = value.slice(1);
    }
    return value;
  }
  return '';
};

export const cleanStringToUpper = (value: string): string => {
  if (value && typeof value === 'string') {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .join('')
      .toUpperCase();
  }
  return '';
};

export const cleanUnderline = (value: string) => {
  return value.trim().split('_').join(' ');
};

export const truncateString = (name: string, maxLength: number) => {
  if (!name) return;
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

export const capitalizeWords = (str: string) => {
  if (!str) return '';
  if (str.length === 1) return str.toUpperCase();

  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const stringTo32Chars = (str: string, padChar: string = '0'): string => {
  if (str.length > 32) {
    return str.slice(0, 32);
  }
  return str.padEnd(32, padChar);
};

export const doIcon = (iconStr: string): string[] => {
  return iconStr.split(' ');
};

export const dayTerm = (days: number) => {
  return days > 1 ? 'dias' : 'dia';
};

export const metadataToStringArray = (metadata: string): string[] => {
  if (metadata) {
    return metadata.trim().replace(/\r/g, '').split('\n');
  }
  return [];
};

export const stringArrayToMetadata = (array: string[]): string => {
  array = [...new Set(array)];
  let finalStr = '';
  for (const value of array) {
    finalStr += value.trim().toUpperCase().replace(/\r/g, '') + '\n';
  }
  return finalStr.trimEnd();
};

export const simplifyNames = (fullname: string) => {
  if (!fullname) return '-';
  const nameArray = fullname.trim().split(' ').filter(Boolean);

  if (nameArray.length === 1) {
    return nameArray[0];
  }

  const firstName = nameArray[0];
  const lastname = nameArray[nameArray.length - 1];
  const middlename: string[] = [];

  nameArray.forEach((name, index) => {
    if (index !== 0 && index !== nameArray.length - 1 && name.length > 3) {
      middlename.push(`${name[0]}.`);
    }
  });

  return `${firstName}${middlename.length ? ' ' + middlename.join(' ') : ''} ${lastname}`;
};

export const getFirstName = (name: string): string | null => {
  return name ? name.split(' ')[0] : null;
};
