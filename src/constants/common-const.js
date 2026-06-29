import dayjs from 'dayjs';
import { getMonthRange } from '/@/utils/date-util.js';

export const APPID = 'resume';

/**
 * The default top-level menu id is 0
 */
export const MENU_DEFAULT_PARENT_ID = 0;

export const MENU_TYPE_ENUM = {
  CATALOG: {
    value: 1,
    desc: 'Catalog',
  },
  MENU: {
    value: 2,
    desc: 'Menu',
  },
  POINTS: {
    value: 3,
    desc: 'Button',
  },
};

export const PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = ['5', '10', '15', '20', '30', '40', '50', '75', '100', '150', '200', '300', '500'];

export const RATE_PRECISION = 4;

// Login page path
export const PAGE_PATH_LOGIN = '/login';

// Home page path
export const HOME_PAGE_PATH = '/home';

// 404 page path
export const PAGE_PATH_404 = '/404';

export const PAGE_PATH_403 = '/403';

export const videoFileType = ['.mp4', '.mov', '.MOV', '.ogv', '.webm'];

export const imgFileType = ['jpg', 'jpeg', 'png'];

export const showTableTotal = function (total) {
  return `${total} in total`;
};

export const FLAG_NUMBER_ENUM = {
  TRUE: {
    value: 1,
    desc: 'Yes',
  },
  FALSE: {
    value: 0,
    desc: 'No',
  },
};

export const GENDER_ENUM = {
  UNKNOWN: {
    value: 0,
    desc: 'Unknown',
  },
  MAN: {
    value: 1,
    desc: 'Male',
  },
  WOMAN: {
    value: 2,
    desc: 'Female',
  },
};

export const DATA_TYPE_ENUM = {
  NORMAL: {
    value: 1,
    desc: 'Normal',
  },
  ENCRYPT: {
    value: 10,
    desc: 'Encrypted',
  },
};

export const RANGE_PRESETS = [
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs()] },
  { label: 'Last Month', value: getMonthRange(-1) },
  { label: 'Last 3 Months', value: getMonthRange(-3) },
  { label: 'Last 6 Months', value: getMonthRange(-6) },
];

export const HOME_PAGE_NAME = 'home';
