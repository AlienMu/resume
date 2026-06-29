<template>
  <a-tabs class="mui-tabs" v-bind="$attrs" size="large">
    <slot></slot>
  </a-tabs>
</template>

<script setup></script>

<style scoped lang="less">
  .mui-tabs {
    :deep(.ant-tabs-tab) {
      font-size: 16px;
      padding: 5px 12px;
    }
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
      &:before {
        border-bottom: none;
      }
    }
    :deep(.ant-tabs-ink-bar) {
      background: transparent !important;
      height: 2px;
      display: flex;
      justify-content: center;
      &:before {
        content: '';
        display: block;
        width: 25px;
        border-radius: 12px;
        background-color: @primary-color !important;
      }
    }
  }
</style>
