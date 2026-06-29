<script setup>
  import notDataImage from '/@/assets/images/common/not-data.png';

  const props = defineProps({
    size: {
      type: String,
      default: 'default',
    },
  });
</script>

<template>
  <a-result>
    <template #icon>
      <a-image :preview="false" :src="notDataImage" :width="size === 'small' ? 100 : 320" />
    </template>
    <template #title>
      <div class="mui-font-size-18">{{ $t('common.notData') }}</div>
    </template>
  </a-result>
</template>

<style scoped lang="less"></style>
