<template>
  <div class="mui-common-result">
    <a-flex gap="15" vertical align="center">
      <a-image :preview="false" width="320px" height="320px" :src="notAuthImage" />
      <span class="mui-font-size-18">{{ getLabel('title') }}</span>
      <span class="mui-font-size-12 mui-desc-text">{{ getLabel('desc') }}</span>
    </a-flex>
  </div>
</template>
<script setup>
  import notAuthImage from '/@/assets/images/common/403.jpg';
  import { useI18nText } from '/@/hooks/use-i18n-text';

  const { getLabel } = useI18nText({ local: 'common.errorPages.403' });
</script>
