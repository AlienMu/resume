/*
 *  权限插件
 */
import { useUserStore } from '/@/store/modules/system/user';
import { computed } from 'vue';

const privilege = (value) => {
  // 超级管理员
  if (useUserStore().administratorFlag) {
    return true;
  }
  // 获取功能点权限
  const userPointsList = computed(() => useUserStore().pointsList?.map((item) => item.identifier) ?? []);
  if (!userPointsList.value) {
    return false;
  }
  return userPointsList.value && userPointsList.value.includes(value);
};

export default {
  install: (app) => {
    app.config.globalProperties.$privilege = privilege;
  },
};
