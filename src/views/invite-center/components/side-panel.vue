<template>
  <a-flex class="side-panel" vertical>
    <div class="title">{{ getLabel('title') }}</div>
    <div class="side-panel-nav">
      <a-menu v-model:selectedKeys="selectedKeys" mode="vertical" :theme="'light'">
        <template v-for="item in menuTree" :key="item.menuId">
          <a-menu-item @click="turnToPage(item)">
            {{ getLabel(`nav.${item.menuName}`) }}
          </a-menu-item>
        </template>
      </a-menu>
    </div>
  </a-flex>
</template>

<script setup>
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/system/user';
  import { computed, ref, watch } from 'vue';
  import { router } from '/@/router';
  import _ from 'lodash';
  import i18n from '/@/i18n';
  import { useI18nText } from '/@/hooks/use-i18n-text';

  let currentRoute = useRoute();

  const { getLabel } = useI18nText({ local: 'inviteCenter.sidePanel' });

  const menuTree = computed(() => {
    const menu = useUserStore().getMenuTree.find((item) => currentRoute.fullPath.indexOf(item.path) > -1)?.children;
    return menu.filter((item) => item.visibleFlag) || [];
  });

  const selectedKeys = ref([]);

  function updateOpenKeysAndSelectKeys() {
    // 更新选中
    selectedKeys.value = [_.toString(currentRoute.name)];
  }

  watch(
    currentRoute,
    () => {
      updateOpenKeysAndSelectKeys();
    },
    {
      immediate: true,
    }
  );

  // 页面跳转
  function turnToPage(menu) {
    console.log(menu);
    useUserStore().deleteKeepAliveIncludes(menu.menuId.toString());
    router.push({ path: menu.path });
  }
</script>

<style scoped lang="less">
  .side-panel {
    background: @base-bg-color;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;

    .title {
      padding: 20px 18px;
      font-size: 14px;
      background: rgba(250, 250, 250, 1);
      color: @font-primary-color;
      line-height: 14px;
      font-weight: 700;
    }
    .side-panel-nav {
      padding: 0 4px 4px 4px;

      :deep(.ant-menu-item) {
        padding: 0 16px;
        line-height: 40px;
        margin: 4px 0 0 0;
        height: 40px;
        width: 100%;
        font-size: 14px;
      }
    }
  }
</style>
