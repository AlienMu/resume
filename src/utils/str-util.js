/*
 * String related utilities
 *
 */

import dayjs from 'dayjs';

/**
 * Convert to camel case
 */
export function convertUpperCamel(str) {
  if (!str) {
    return '';
  }

  str = str.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
  // Capitalize the first letter
  return str[0].toUpperCase() + str.substring(1);
}

/**
 * @method getFormatText
 * @description Format text and append the appropriate unit
 * @param value {'price' | 'priceUnit' | 'date' | 'day' | 'ratio' | 'periods' | 'default'}
 * @param unit
 */

export const getFormatText = (value, unit = 'default') => {
  if (value === null || value === undefined || value === '') return '-';
  const unitConfig = {
    price() {
      if (typeof value !== 'number') return value;
      return value.toFixed(2);
    },
    priceUnit() {
      return this.price() + ' CNY';
    },
    priceUnitMyriad() {
      return this.price() + ' (10k CNY)';
    },
    date() {
      return 'Day ' + value;
    },
    age() {
      return value + ' yrs';
    },
    km() {
      return value + 'KM';
    },
    year() {
      return value + ' yr';
    },
    day() {
      return value + ' days';
    },
    ratio() {
      return value + '%';
    },
    periods() {
      return value + ' periods';
    },
    'YYYY-MM-DD'() {
      return dayjs(value).format('YYYY-MM-DD');
    },
    default() {
      return value;
    },
  };
  return unitConfig[unit]?.();
};

// Get the file extension from a URL
export const getUrlFileType = (url) => {
  return url?.match(/[^/]+\.(\w{2,})$/) && url?.match(/[^/]+\.(\w{2,})$/)[1];
};

/*
 * Get the file name
 * */
export function getFileName(path) {
  const regex = /[^\\/]+(?=\/?$)/;
  const match = path.match(regex);
  return match ? match[0] : '';
}
