<template>
  <a-tag class="color-tag" :class="type">
    <slot></slot>
  </a-tag>
</template>

<script setup>
  const props = defineProps({
    type: {
      type: String,
      default: 'primary',
    },
  });
</script>

<style scoped lang="less">
  .color-tag {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    padding: 1px 6px 1px 6px;
    border-radius: 2px;
    border: none;
    &.primary {
      color: #fff;
      background: @primary-color;
    }
    &.black {
      color: #fff;
      background: rgba(19, 44, 79, 1);
    }
    &.gray {
      color: #fff;
      background: rgba(90, 113, 145, 1);
    }
    &.ghost {
      color: @primary-color;
      background: rgba(@primary-color, 0.1);
    }
  }
</style>
