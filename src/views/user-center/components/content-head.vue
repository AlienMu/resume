<template>
  <a-flex class="content-head" justify="space-between" align="center">
    <a-flex align="center" gap="10">
      <div class="title">{{ $t(`userCenter.sidePanel.nav.${route.name}`) }}</div>
      <div class="tips" v-show="tips">{{ tips }}</div>
    </a-flex>
    <slot></slot>
  </a-flex>
</template>

<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const props = defineProps({
    tips: String,
  });
</script>

<style scoped lang="less">
  .content-head {
    padding: 17px 24px 17px 40px;
    .title {
      font-size: 20px;
      color: @font-sub-color;
      line-height: 36px;
      font-weight: 700;
    }
    .tips {
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      color: @font-tip-color;
    }
  }
</style>
