// src/utils/stringUtils.ts
export function sliceString(str: string, step: number = 2): string {
  let result = '';
  for (let i = 0; i < str.length; i += step) {
    result += str[i];
  }
  return result;
}

// Or as a one-liner:
export const sliceEverySecondChar = (str: string): string => 
  str.split('').filter((_, index) => index % 2 === 0).join('');

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const toLower = (text: string): string => {
  return text.toLowerCase();
}
