<template>
  <div class="mui-common-result">
    <a-flex align="center" gap="80">
      <a-image width="288px" height="322px" :src="notFondImage" :preview="false" />
      <a-flex vertical gap="30">
        <a-flex vertical gap="16">
          <span class="mui-font-size-18">{{ getLabel('title') }}</span>
          <span class="mui-font-size-12 mui-desc-text">{{ getLabel('desc.0') }}</span>
          <span class="mui-font-size-12 mui-desc-text">{{ getLabel('desc.1') }}</span>
          <span class="mui-font-size-12 mui-desc-text">{{ getLabel('desc.2') }}</span>
          <span class="mui-font-size-12 mui-desc-text">{{ getLabel('desc.3') }}</span>
        </a-flex>
        <a-flex gap="16">
          <a-button type="primary" ghost @click="goHome">{{ getLabel('button', 1) }}</a-button>
          <a-button type="primary" @click="goHome">{{ getLabel('button', 2) }}</a-button>
        </a-flex>
      </a-flex>
    </a-flex>
  </div>
</template>
<script setup>
  import { useRouter } from 'vue-router';
  import { HOME_PAGE_NAME } from '/@/constants/common-const';
  import notFondImage from '/@/assets/images/common/404.jpg';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  const router = useRouter();

  const { getLabel } = useI18nText({ local: 'common.errorPages.404' });

  function goHome() {
    router.push({ name: HOME_PAGE_NAME });
  }
</script>
