<template>
  <a-layout class="admin-layout" :class="{ 'work-bg': isWork }">
    <!-- Top menu -->
    <a-affix :offset-top="0" @change="onAffixChange">
      <a-layout-header v-if="!isLoginPage" class="top-menu" :class="{ transparent: isWork && !isAffixed }" theme="dark" :id="LAYOUT_ELEMENT_IDS.menu">
        <TopMenu />
      </a-layout-header>
      <announcement />
    </a-affix>
    <!--Main content-->
    <a-layout-content ref="contentRef" :class="isLoginPage && 'not-header'" :id="LAYOUT_ELEMENT_IDS.content" class="admin-layout-content">
      <!--Non-iframe pages use router-view-->
      <div class="admin-layout-content-wrap" v-show="!iframeNotKeepAlivePageFlag && keepAliveIframePages.every((e) => route.name !== e.name)">
        <router-view v-slot="{ Component }">
          <keep-alive :include="keepAliveIncludes">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </a-layout-content>
    <!-- footer copyright / company info -->
    <a-layout-footer v-if="!isLoginPage" class="layout-footer">
      <Footer />
    </a-layout-footer>
    <!--- Customer service floating button -->
    <a-float-button shape="square" class="mui-float-button" :style="{ bottom: '220px', right: '10px' }" @click="handleCustomerServiceClick">
      <template #icon>
        <svg-icon name="customer" />
      </template>
      <template #description>
        <div class="customer-desc">
          <div class="customer-title">{{ $t('common.customerService.title') }}</div>
          <div class="customer-divider"></div>
          <div class="customer-hours-title">{{ $t('common.customerService.serviceHoursTitle') }}</div>
          <div class="customer-timezone">{{ $t('common.customerService.timezone') }}</div>
          <div class="customer-working-days">{{ $t('common.customerService.workingDays') }}</div>
          <div class="customer-hours">{{ $t('common.customerService.hoursMorning') }}</div>
          <div class="customer-hours">{{ $t('common.customerService.hoursAfternoon') }}</div>
        </div>
      </template>
    </a-float-button>
  </a-layout>
</template>

<script setup>
  import TopMenu from './components/top-menu/index.vue';
  import Footer from './components/footer/index.vue';
  import { muiKeepAlive } from './components/mui-keep-alive';
  import { LAYOUT_ELEMENT_IDS } from '/@/layout/layout-const.js';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Announcement from '/@/layout/components/announcement/announcement.vue';
  import { useUserStore } from '/@/store/modules/system/user';

  const userStore = useUserStore();
  const contentRef = ref();

  const isLoginPage = computed(() => route.name === 'login');

  const isWork = computed(() => route.name === 'home');

  const isAffixed = ref(false);

  //Back to top
  const onAffixChange = (boole) => {
    isAffixed.value = boole;
  };

  // Customer service button click handler
  const handleCustomerServiceClick = () => {
    const telegram = userStore.siteConfig?.sidebarCustomerTelegram;
    if (telegram) {
      window.open(telegram, '_blank');
    }
  };

  // ----------------------- keep-alive related -----------------------
  let { route, keepAliveIncludes, iframeNotKeepAlivePageFlag, keepAliveIframePages } = muiKeepAlive();
</script>

<style lang="less" scoped>
  .admin-layout {
    min-height: 100%;

    &.work-bg {
      background-image: url(~'/@/assets/images/work/bg.jpg');
      background-size: 100% auto;
      background-color: #f0f4f7;
      background-position: top center;
      background-repeat: no-repeat;
      overflow: hidden;

      .admin-layout-content {
        background: transparent;
        &:before {
          display: none;
        }
      }
    }

    .top-menu {
      padding: 0;
      height: 48px;
      line-height: 48px;
      width: 100%;
      z-index: 4;
      right: 0;
      background-color: rgba(41, 45, 69, 1);
      transition: all 0.3s;
      &.transparent {
        background-color: transparent;
      }
    }

    .admin-layout-content {
      background-color: inherit;
      min-height: auto;
      position: relative;
      overflow-x: hidden;
      width: 100%;

      background: @border-color;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 303px;
        background: linear-gradient(180deg, rgba(171, 206, 255, 1) 0%, rgba(209, 228, 255, 1) 31.94%, rgba(209, 228, 255, 0) 100%);
      }

      .admin-layout-content-wrap {
        position: relative;
        margin-left: auto;
        margin-right: auto;
      }
      .page-tag-div {
        position: fixed;
        top: 48px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        z-index: 3;
      }
    }
  }

  .layout-footer {
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  /* Customer service floating panel styles */
  .mui-float-button {
    width: 69px;

    :deep(.ant-float-btn) {
      width: 100%;
      padding: 10px 4px;
    }
    :deep(.ant-float-btn-content) {
      padding-top: 12px;
    }
    :deep(.ant-float-btn-body) {
      .ant-float-btn-icon {
        font-size: 29px;
        width: 29px;
      }
      width: 100%;
    }
    .customer-desc {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 12px;
      box-sizing: border-box;
      color: rgba(85, 88, 105, 1);
    }

    .customer-title {
      font-size: 12px;
      font-weight: 600;
      align-self: center;
      color: rgba(54, 66, 90, 1);
      margin-top: 4px;
    }

    .customer-divider {
      width: 61px;
      height: 1px;
      background: rgba(240, 244, 247, 1);
      margin: 8px 0;
      opacity: 0.6;
    }

    .customer-hours-title {
      font-size: 12px;
      font-weight: 600;
      color: rgba(85, 88, 105, 1);
    }

    .customer-timezone,
    .customer-working-days {
      font-size: 12px;
      color: rgba(163, 166, 184, 1);
      margin-top: 4px;
    }

    .customer-hours {
      font-size: 12px;

      color: rgba(163, 166, 184, 1);
      line-height: 1.1;
      margin-top: 4px;
    }
  }
</style>
