/*
 * 所有常量入口
 *

 */
import { FLAG_NUMBER_ENUM, GENDER_ENUM, HOME_PAGE_NAME } from './common-const';
import { LAYOUT_ENUM } from './layout-const';
import * as ApiConstants from './api-const';

export default {
  FLAG_NUMBER_ENUM,
  GENDER_ENUM,
  LAYOUT_ENUM,
  HOME_PAGE_NAME,
  ...ApiConstants,
};
