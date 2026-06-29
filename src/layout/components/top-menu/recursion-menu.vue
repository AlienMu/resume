<!--
  * Top menu - recursive menu
-->
<template>
  <div class="menu-nav" :class="!menuTree.find((item) => item.menuId === selectedKey) && 'bar-none'">
    <div class="menu-tabs" style="padding: 0 20px">
      <template v-for="item in menuTree" :key="item.menuId">
        <div v-if="item.visibleFlag" class="menu-tab-item" @click="turnToPage(item.menuId)">
          <div class="menu-item" :class="item.menuId === selectedKey && 'active'">
            {{ $t(`header.nav.${item.menuId}`) }}
          </div>
          <div v-if="item.menuId === selectedKey" class="menu-ink-bar">
            <div class="menu-ink-bar-inner"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
  import _ from 'lodash';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { router } from '/@/router';
  import { useUserStore } from '/@/store/modules/system/user';

  const menuTree = computed(() =>
    useUserStore()
      .getMenuTree.filter((item) => item.visibleFlag)
      .sort((a, b) => a.sort - b.sort)
  );

  // Expanded menu
  let currentRoute = useRoute();

  const selectedKey = ref();

  // Navigate to page
  function turnToPage(val) {
    const menu = menuTree.value.find((item) => item.menuId === val);
    useUserStore().deleteKeepAliveIncludes(menu.menuId.toString());
    window.open(menu.path);
  }

  // Open community link
  function openCommunity() {
    window.open('https://t.me/example', '_blank');
  }

  /**
   * In rmAdmin, the router name is the menu id stored on the backend,
   * so we can watch the route directly and update the menu selection and expansion based on it
   */
  function updateSelectKeys() {
    // Update selection
    const parentKey = menuTree.value.find((item) => currentRoute.fullPath.indexOf(item.path) > -1)?.menuId;
    selectedKey.value = _.toString(parentKey);
  }

  watch(
    currentRoute,
    () => {
      updateSelectKeys();
    },
    {
      immediate: true,
    }
  );

  defineExpose({
    updateSelectKeys,
  });
</script>

<style lang="less" scoped>
  .menu-nav {
    display: flex;
    height: @header-user-height;
    align-items: center;

    .menu-tabs {
      display: flex;
      align-items: flex-start;
      padding-top: 6px;
    }

    .menu-tab-item {
      position: relative;
      cursor: pointer;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &.bar-none {
      .menu-ink-bar {
        display: none;
      }
    }

    .menu-ink-bar {
      background: transparent;
      height: 4px;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .menu-ink-bar-inner {
      width: 25px;
      height: 100%;
      border-radius: 12px;
      background-color: rgba(46, 133, 255, 1);
    }
  }

  .menu-item {
    line-height: 16px;
    font-size: 14px;
    font-weight: 400;
    transition-duration: 0.3s;
    color: #fff;
    margin-bottom: 6px;
    &.active {
      font-weight: 700;
    }
  }
</style>
