<template>
  <a-flex justify="center" style="width: 100%">
    <a-pagination size="default" showSizeChanger showQuickJumper class="mui-pagination" v-bind="{ ...pagination, ...$attrs }" />
  </a-flex>
</template>

<script setup>
  const props = defineProps({
    pagination: {
      type: Object,
      default: () => ({}),
    },
  });
</script>

<style lang="less" scoped>
  .mui-pagination {
    font-size: 14px;
    :deep(.ant-pagination-item) {
      min-width: 32px;
      min-height: 30px;
      line-height: 28px;
      &.ant-pagination-item-active {
        background-color: rgba(232, 243, 255, 1) !important;
        border: none;
      }
      a {
        line-height: 32px;
      }
    }
    :deep(.ant-pagination-options) {
      .ant-select {
        width: 96px;

        .ant-select-selector {
          font-size: 14px;
          background-color: rgba(242, 243, 245, 1);
          border-color: rgba(242, 243, 245, 1);
        }
      }
      .ant-pagination-options-quick-jumper {
        margin-inline-start: 10px;
        color: rgba(134, 144, 156, 1);
        input {
          font-size: 14px;
          background-color: rgba(242, 243, 245, 1);
          border-color: rgba(242, 243, 245, 1);
          margin-inline: 10px;
        }
      }
    }
  }
</style>
