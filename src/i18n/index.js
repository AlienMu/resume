/*
 * 国际化入口文件
 */

import en_US from './lang/en-US/index';
import zh_CN from './lang/zh-CN/index';
import { createI18n } from 'vue-i18n';
import { localRead, localSave } from '/@/utils/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';

// 语言选择数组
export const i18nList = [
  {
    text: '简体中文',
    value: 'zh_CN',
  },
  {
    text: 'English',
    value: 'en_US',
  },
];

export const messages = {
  zh_CN: zh_CN,
  en_US: en_US,
};

const DEFAULT_LOCALE = 'en_US';

// 读取缓存语言（不存在或非法时回退默认）
const getCachedLocale = () => {
  const cached = localRead(LocalStorageKeyConst.LOCALE);
  return messages[cached] ? cached : DEFAULT_LOCALE;
};

const i18n = createI18n({
  fallbackLocale: DEFAULT_LOCALE, //预设语言环境
  globalInjection: true,
  legacy: false, //
  locale: getCachedLocale(), //默认初始化的语言（优先读缓存）
  messages, //
});

// 切换并缓存语言
export const setLocale = (locale) => {
  if (!messages[locale]) return;
  i18n.global.locale.value = locale;
  localSave(LocalStorageKeyConst.LOCALE, locale);
};

export const getLocale = () => i18n.global.locale.value;

export default i18n;
