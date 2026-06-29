<!--
  * Full header row
  *
-->
<template>
  <a-space :size="10">
    <div class="setting">
      <!---Message notifications--->
      <HeaderMessage ref="headerMessage" />
    
      <a-button type="text" @click="showSetting" class="operate-icon">
        <template #icon><setting-outlined /></template>
      </a-button>
    </div>
    <!---Avatar info--->
    <div class="user-space-item">
      <HeaderAvatar />
    </div>

  </a-space>
</template>

<script setup>
  import HeaderAvatar from './header-avatar.vue';
  import HeaderSetting from './header-setting.vue';
  import HeaderMessage from './header-message.vue';
  import { computed, ref } from 'vue';
  import { theme } from 'ant-design-vue';

  // Settings
  const headerSetting = ref();
  function showSetting() {
    headerSetting.value.show();
  }

  const { useToken } = theme;
  const { token } = useToken();
</script>

<style lang="less" scoped>
  .user-space-item {
    height: 100%;
    color: inherit;
    padding: 0 12px;
    cursor: pointer;
    align-self: center;

    a {
      color: inherit;

      i {
        font-size: 16px;
      }
    }
  }

  .user-space-item:hover {
    color: v-bind('token.colorPrimary');
    background-color: @hover-bg-color !important;
  }

  .setting {
    height: @header-user-height;
    line-height: @header-user-height;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }
  .operate-icon {
    margin-left: 20px;
  }
</style>
