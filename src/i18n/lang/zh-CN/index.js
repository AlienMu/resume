/*
 * 中文国际化
 * 统一整合AntD、DayJS及业务端所有语言配置
 */
import antd from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs/locale/zh-cn';
import primary from './primary.lang';
import { common } from './common.lang';

export default {
  // Ant Design Vue 组件库中文本地化配置
  antdLocale: antd,
  // DayJS 时间库中文本地化配置
  dayjsLocale: dayjs,
  // 全平台通用公共语言配置（已适配双时区+国际格式）
  common,
  // 业务端所有核心语言配置（求职/企业/公共页面等，已全量优化）
  ...primary,
};
