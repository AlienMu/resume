<template>
  <a-radio class="mui-radio" v-bind="$attrs">
    <span class="mui-radio-text"><slot></slot></span>
  </a-radio>
</template>

<script setup></script>

<style lang="less">
  .mui-radio {
    margin-inline-end: 17px;
    &.ant-radio-wrapper-checked {
      .mui-radio-text {
        color: @primary-color !important;
      }
    }
    .ant-radio {
      &.ant-radio-checked {
        .ant-radio-inner {
          &:after {
            background-image: url(~'/@/assets/images/icons/radio-select.svg');
            background-size: cover;
            background-repeat: no-repeat;
            background-color: transparent;
            width: 7px;
            height: 5px;
            margin-block-start: -2.5px;
            margin-inline-start: -3.5px;
            transform: none !important;
            transition: none;
          }
          border-color: transparent;
        }
      }
      .ant-radio-inner {
        border-color: rgba(145, 151, 159, 1);
      }
    }
  }
</style>
