<!--
  * 消息通知
  *
-->

<template>
  <a-button type="text" @click="gotoMessage" style="padding: 4px 5px">
    <a-badge
      :number-style="{
        backgroundColor: 'rgba(255, 166, 0, 1)',
        color: '#fff',
        boxShadow: 'none',
        lineHeight: '12px',
        height: '12px',
        padding: '0 2px',
        borderRadius: '3px',
      }"
      :count="unreadMessageCount"
    >
      <span style="color: #fff">{{ getLabel('message') }}</span>
    </a-badge>
  </a-button>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/system/user.js';
  import { muiSentry } from '/@/lib/mui-sentry.js';
  import dayjs from 'dayjs';
  import { theme } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import MessageDetailModal from './header-message-detail-modal.vue';
  import localKey from '/@/constants/local-storage-key-const';
  import { localRead } from '/@/utils/local-util';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { USER_TYPE_ENUM } from '/@/constants/api-const';

  const { useToken } = theme;
  const { token } = useToken();

  const loading = ref(false);

  const { getLabel } = useI18nText({ local: 'layout' });

  // 未读消息
  const userStore = useUserStore();
  const unreadMessageCount = computed(() => userStore.unreadMessageCount || 0);

  const router = useRouter();

  function gotoMessage() {
    router.push({ path: '/account', query: { menuId: 'message' } });
    switch (userStore.userType) {
      case USER_TYPE_ENUM.PERSON.value:
        router.push({ name: 'message' });
        break;
      case USER_TYPE_ENUM.COMPANY.value:
        router.push({ name: 'messageCenter' });
        break;
      case USER_TYPE_ENUM.INVITED.value:
        router.push({ name: 'inviteMessageCenter' });
        break;
    }
  }
</script>

<style lang="less" scoped>
  @mui-page-tag-operate-width: 40px;
  @color-primary: v-bind('token.colorPrimary');

  .message-icon-div {
    cursor: pointer;
    height: 32px;
    width: 42px;
    padding-left: 10px;
  }

  .message-icon-div:hover {
    background: @hover-bg-color !important;
  }

  .header-notice {
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }

    .notice-badge {
      color: inherit;
    }
  }

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .dropdown-tabs {
    background-color: @base-bg-color;
    border-radius: 4px;
  }

  .tab-pane {
    height: auto;
  }
</style>
