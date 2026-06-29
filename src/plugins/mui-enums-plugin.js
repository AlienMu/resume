import { muiEnumPlugin } from '/@/utils/desc-util';

export default {
  install: (app) => {
    app.config.globalProperties.$muiEnumPlugin = muiEnumPlugin;
    app.provide('muiEnumPlugin', muiEnumPlugin);
  },
};
