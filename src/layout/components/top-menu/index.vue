<!--
  * Top menu
-->
<template>
  <!--Three sections in total: 1. logo area, containing logo and name; 2. menu area; 3. user actions area-->
  <div class="header-main">
    <!-- 1. logo area -->
    <div class="logo" @click="onGoHome">
      <div class="logo-img">
        <img :src="logoUrl" alt="" />
      </div>
    </div>
    <!-- 2. menu area -->
    <RecursionMenu ref="menuRef" />

    <!-- 3. User actions area -->
    <div class="user-space">
      <!---Language switcher--->
      <a-dropdown :trigger="['click']" placement="bottomRight">
        <div class="lang-switch" @click.prevent>
          <global-outlined class="lang-icon" />
          <span class="lang-text">{{ currentLangText }}</span>
        </div>
        <template #overlay>
          <a-menu :selected-keys="[currentLocale]" @click="onSelectLocale">
            <a-menu-item v-for="item in i18nList" :key="item.value">{{ item.text }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-button
        style="
          padding: 0 14px;
          height: 28px;
          white-space: nowrap;
          background: linear-gradient(270deg, rgba(0, 106, 255, 1) 0%, rgba(151, 77, 255, 1) 100%);
          border: none;
        "
        type="primary"
        v-if="!userStore.token"
        @click="router.push({ name: 'login' })"
      >
        {{ $t('header.login') }}
      </a-button>
      <template v-else>
        <div class="setting">
          <!---Message notifications--->
          <HeaderMessage ref="headerMessage" />
        </div>
        <!---Avatar info--->
        <div class="user-space-item">
          <HeaderAvatar />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { GlobalOutlined } from '@ant-design/icons-vue';
  import RecursionMenu from './recursion-menu.vue';
  import HeaderAvatar from '../header-user-space/header-avatar.vue';
  import HeaderMessage from '../header-user-space/header-message.vue';
  import { HOME_PAGE_NAME } from '/@/constants/common-const';
  import defaultLogoUrl from '/@/assets/images/logo/logo-white.png';
  import { useUserStore } from '/@/store/modules/system/user';
  import { i18nList, setLocale, getLocale } from '/@/i18n';

  const userStore = useUserStore();
  const logoUrl = computed(() => userStore.siteConfig.faviconImage.imageUrl || defaultLogoUrl);

  // Language switcher
  const currentLocale = computed(() => getLocale());
  const currentLangText = computed(() => i18nList.find((i) => i.value === currentLocale.value)?.text ?? 'English');
  const onSelectLocale = ({ key }) => setLocale(key);

  const props = defineProps({
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
  //Message notifications
  const headerMessage = ref();

  const menuRef = ref();

  watch(
    () => props.collapsed,
    (newValue) => {
      // If the menu is expanded, re-fetch and update the menu's open items: openKeys and selectKeys
      if (!newValue) {
        menuRef.value.updateSelectKeys();
      }
    }
  );

  const color = computed(() => {
    let isLight = true;
    return {
      color: isLight ? '#001529' : '#FFFFFF',
      background: isLight ? '#FFFFFF' : '#001529',
    };
  });

  const router = useRouter();

  function onGoHome() {
    router.push({ name: HOME_PAGE_NAME });
  }
</script>

<style lang="less" scoped>
  .header-main {
    max-width: 1440px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    padding-left: 12px;
    height: @header-user-height;
    z-index: 21;

    .logo {
      width: 400px;
      justify-content: left;
    }
    .user-space {
      width: 400px;
      padding-right: 12px;
      color: v-bind('color.color');
      display: flex;
      flex-direction: row;
      vertical-align: middle;
      align-items: center;
      justify-content: flex-end;

      .lang-switch {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-right: 16px;
        cursor: pointer;
        white-space: nowrap;
        color: #fff;
        .lang-icon {
          font-size: 16px;
        }
        .lang-text {
          font-size: 14px;
        }
        &:hover {
          color: @primary-color;
        }
      }

      .setting {
        height: @header-user-height;
        line-height: @header-user-height;
        vertical-align: middle;
        display: flex;
        align-items: center;

        :deep(.ant-badge) {
          color: v-bind('color.color');
        }
      }

      .operate-icon {
        margin-left: 20px;
        color: v-bind('color.color');
      }

      .user-space-item {
        margin-left: 10px;
      }
    }
  }

  :deep(.ant-menu-horizontal) {
    border-bottom: 0;
  }

  .logo {
    height: @header-user-height;
    z-index: 21;
    display: flex;
    left: 0;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-bottom: none;
    &.home {
      background: @primary-color;
      border-bottom: 1px solid #eeeeee;
      .title {
        color: #2c2c35;
      }
      &:before {
        background: #fff;
      }
    }

    .logo-img {
      height: 32px;
      overflow: hidden;
      display: flex;
      align-items: center;
      z-index: 2;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .title {
    font-weight: 500;
    font-size: 18px;
    margin-left: 6px;
    color: #fff;
    text-align: center;
    font-style: normal;
    text-transform: none;
    position: relative;
    z-index: 2;
    transition-duration: 0.3s;
  }
</style>
