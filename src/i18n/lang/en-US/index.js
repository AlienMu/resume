/*
 * English i18n
 * Mirrors the zh-CN entry: combines AntD / DayJS locales with business strings.
 */
import antd from 'ant-design-vue/es/locale/en_US';
import dayjs from 'dayjs/locale/en';
import primary from './primary.lang';
import { common } from './common.lang';

export default {
  // Ant Design Vue component locale
  antdLocale: antd,
  // DayJS locale
  dayjsLocale: dayjs,
  // Shared common strings
  common,
  // Core business strings (job seeking / enterprise / public pages)
  ...primary,
  // Settings panel
  'setting.title': 'Setting',
  'setting.color': 'Theme Color',
  'setting.menu.layout': 'Menu Layout',
  'setting.menu.width': 'Menu Width',
  'setting.menu.theme': 'Menu Theme',
  'setting.page.width': 'Page Width',
  'setting.border.radius': 'Border Radius',
  'setting.compact': 'Page Compact',
  'setting.bread': 'Show Bread',
  'setting.pagetag': 'Show PageTag',
  'setting.pagetag.style': 'PageTag Style',
  'setting.footer': 'Show Footer',
  'setting.watermark': 'Show Watermark',
};
