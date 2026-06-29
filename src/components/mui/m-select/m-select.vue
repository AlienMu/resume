<template>
  <a-select popupClassName="mui-select-menu" class="mui-select" v-bind="$attrs">
    <template #notFoundContent><span>No data</span> </template>
    <template #suffixIcon v-if="isCustomerIcon">
      <div class="icon">
        <svg-icon name="arrow" />
      </div>
    </template>
    <slot></slot>
  </a-select>
</template>

<script setup>
  import notDataImage from '/@/assets/images/common/not-data.png';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';

  const props = defineProps({
    isCustomerIcon: Boolean,
  });
</script>

<style lang="less">
  .mui-select {
    font-size: 14px;
    position: relative;
    &.ant-select-open {
      .icon {
        transform: rotate(180deg);
      }
    }
    .icon {
      transition: all 0.3s;
    }
    .ant-select-selector {
      width: 100% !important;
      height: 100% !important;
      min-width: 80px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: inherit;
      text-align: center;
      padding: 0 !important;
      display: flex;
      align-items: center;
    }
    .ant-select-selection-placeholder,
    .ant-select-selection-item {
      color: @font-primary-color;
      font-size: inherit;
      padding-inline-end: 0;
      text-align: center;
    }

    .ant-select-arrow {
      inset-inline-end: 12px;
    }
    .ant-select-selection-search {
      inset-inline-start: 4px;
      display: flex;
      align-items: center;
    }
  }
</style>
