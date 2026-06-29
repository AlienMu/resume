<template>
  <a-form-item
    :class="{ 'mui-form-item--large': size === 'large', 'mui-form-item--middle': size === 'middle' }"
    class="mui-form-item"
    :name="name"
    :no-style="noStyle"
    :label="label"
    ref="formItemRef"
    :required="required"
    v-bind="$attrs"
  >
    <a-flex class="m-form-item" :vertical="vertical" :class="{ 'm-form-item--vertical': vertical }">
      <div class="m-form-item__label" v-if="label || $slots.label" :style="{ width: labelWidth + 'px' }">
        <slot name="label"> {{ label }}<b v-if="required || $attrs.rules?.some((item) => item.required)">*</b> </slot>
      </div>
      <div class="m-form-item__content">
        <slot></slot>
      </div>
    </a-flex>
  </a-form-item>
</template>

<script setup>
  const props = defineProps({
    name: [String, Array],
    label: String,
    required: Boolean,
    vertical: Boolean,
    size: {
      type: String,
      default: 'default',
    },
    noStyle: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: Number,
      default: 120,
    },
  });
</script>

<style lang="less">
  .mui-form-item {
    margin-bottom: 10px;
    &--middle {
      margin-bottom: 20px;
    }
    &--large {
      margin-bottom: 30px;
    }
    transition: all 0.3s;
    &.ant-form-item-with-help {
      .ant-form-item-explain-error {
        margin: 5px 0;
      }
    }
    .ant-form-item-label {
      display: none;
    }
  }

  .m-form-item {
    border: 1px solid rgba(231, 231, 231, 1);
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    border-radius: 4px;
    background: #fff;
    overflow: hidden;

    .mui-select {
      .ant-select-selector {
        min-height: 36px;
      }
      min-height: 36px;
    }
    &.m-form-item--vertical {
      .m-form-item__label:before {
        display: none;
      }
    }
    &:has(.ant-input-disabled),
    &:has(.ant-select-disabled) {
      .m-form-item__label {
        background: rgba(0, 0, 0, 0.04);
      }
    }
    &:has(.ant-input-status-error) {
      border: 1px solid @error-color !important;
      &.focused {
        box-shadow: 0 0 0 2px rgba(@error-color, 0.1);
      }
      &:hover {
        box-shadow: 0 0 0 2px rgba(@error-color, 0.1);
        .m-form-item__label {
          &:before {
            background: @error-color;
            box-shadow: 0 0 0 2px rgba(@error-color, 0.1);
          }
        }
      }
      .m-form-item__label {
        &:before {
          background: @error-color;
          box-shadow: 0 0 0 2px rgba(@error-color, 0.1);
        }
      }
    }
    &.focused {
      border-color: @sub-color;
      box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    }
    &:hover {
      border-color: @sub-color;
      box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
      .m-form-item__label {
        &:before {
          background: @sub-color;
          box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
        }
      }
    }
    .m-form-item__label {
      padding-left: 11px;
      font-size: 14px;
      font-weight: 400;
      width: 120px;
      height: 36px;
      position: relative;
      line-height: 36px;

      &:has(.ant-select) {
        padding-left: 0;
      }

      b {
        color: rgba(255, 87, 51, 1);
        font-weight: normal;
      }

      &:before {
        content: '';
        position: absolute;
        right: 0;
        width: 1px;
        height: 100%;
        background: rgba(231, 231, 231, 1);
        z-index: 2;
        transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }

    .m-form-item__content {
      display: flex;
      flex: 1;
      align-items: center;
    }
    textarea {
      padding: 0 12px !important;
      resize: none;
    }
    .ant-input {
      font-size: 14px;
      padding: 7px 12px;
      border-radius: 0;
    }
    .ant-select {
      &.ant-select-multiple {
        .ant-select-selection-placeholder {
          inset-inline-start: 12px;
          inset-inline-end: 0;
        }
      }
      .ant-select-selector {
        height: 100%;
        padding-left: 12px !important;
        .ant-select-selection-item {
          line-height: 100%;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ant-select-selection-overflow-item {
          .ant-select-selection-item {
            line-height: 24px;
            padding-inline-end: 8px !important;
          }
          .ant-select-selection-item-remove {
            line-height: 24px;
          }
        }
        .ant-select-selection-item-remove {
          line-height: 100%;
        }
        .ant-select-selection-search {
          inset-inline-start: 4px;
          .ant-select-selection-search-input {
            height: 100%;
          }
        }
        .ant-select-selection-placeholder {
          line-height: 100%;
          color: @font-tip-color;
          text-align: left;
        }
      }
    }
    .ant-radio-group {
      padding-left: 10px;
    }

    .ant-input-affix-wrapper {
      padding: 0 10px 0 0;
      border: none;
    }
    .ant-input-number-input {
      padding: 0;
    }

    .ant-input,
    .ant-select-selector,
    .ant-input-number,
    .ant-picker {
      border: none !important;
      box-shadow: none !important;
      padding-left: 15px !important;
    }
    .ant-picker {
      height: 100%;
    }
  }
</style>
