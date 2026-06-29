<template>
  <a-flex class="user-center" gap="16" :class="isJobEdit && 'hide-menu'">
    <div class="side-panel">
      <side-panel />
    </div>
    <div class="content" id="user-center-content">
      <transition @leave="leave" @enter="enter" @before-enter="beforeEnter">
        <router-view />
      </transition>
    </div>
  </a-flex>
</template>

<script setup>
  import SidePanel from './components/side-panel.vue';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  import { useFadeAnime } from '/@/hooks/use-anime';

  const isJobEdit = computed(() => route.name === 'invite-resume-edit');

  const route = useRoute();

  const { leave, beforeEnter, enter } = useFadeAnime();
</script>
<style lang="less" scoped>
  .content {
    max-height: inherit !important;
  }
  .user-center {
    padding: 20px 0;
    max-width: 1440px;
    margin: 0 auto;
    &.hide-menu {
      .side-panel {
        opacity: 0;
        width: 0;
        transform: translateX(-160px);
      }
    }
  }
  .side-panel {
    overflow-y: auto;
    width: 160px;
    transition: 0.3s ease-in-out;
  }
  .content {
    flex: 1;
    transition: width 0.3s ease-in-out;
    background: @base-bg-color;
    overflow-y: auto;
    border-radius: 8px;

    margin: 0 auto;
    min-height: calc(100vh - 108px - 213px);
  }
</style>
<route>
{
parentId: 0,
auth: 'invite-center',
hideInMenu: true,
redirect: '/invite-center/my-income'
}
</route>
