<template>
  <div class="svg-icon">
    <svg aria-hidden="true">
      <use :xlink:href="`#icon-${name}`" />
    </svg>
  </div>
</template>

<script setup>
  defineProps({
    name: {
      type: String,
      required: true,
    },
  });
</script>
<style lang="less">
  .svg-icon {
    display: inline-flex;
    line-height: 1em;
    text-align: center;
    text-transform: none;

    svg {
      display: inline-block;
      vertical-align: top;
      width: 1em;
      height: 1em;
    }
  }
</style>
