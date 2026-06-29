<!--
  * 底部：版权、公司等信息
-->
<template>
  <div class="footer">
    <div class="wrap">
      <a-flex vertical gap="12">
        <div class="logo">
          <img :src="logoUrl || logoSub" alt="" />
        </div>
        <div class="title-sub">{{ $t('footer.subTitle') }}</div>
      </a-flex>
      <a-flex gap="100" style="margin-right: auto">
        <a-flex vertical class="desc" gap="16">
          <span class="title">{{ $t('footer.serviceType.title') }}</span>
          <span>{{ $t('footer.serviceType.job') }}</span>
          <span>{{ $t('footer.serviceType.recruit') }}</span>
          <span>{{ $t('footer.serviceType.ad') }}</span>
          <span>{{ $t('footer.serviceType.varied') }}</span>
        </a-flex>
        <a-flex vertical class="desc" gap="16">
          <span class="title">{{ $t('footer.contact.title') }}</span>
          <template v-if="siteConfig.footerCooperationTelegram || siteConfig.footerCooperationEmail">
            <span v-if="siteConfig.footerCooperationTelegram">
              {{ $t('footer.contact.telegramLabel') }}{{ siteConfig.footerCooperationTelegram }}
            </span>
            <span v-if="siteConfig.footerCooperationEmail"> {{ $t('footer.contact.emailLabel') }}{{ siteConfig.footerCooperationEmail }} </span>
          </template>
          <template v-else>
            <span v-html="$t('footer.contact.telegram')"></span>
            <span v-html="$t('footer.contact.email', { symbol: '@' })"></span>
          </template>
        </a-flex>
        <a-flex vertical class="desc" gap="16">
          <span class="title">{{ $t('footer.link.title') }}</span>
          <a href="/login?key=invite" class="link-item">{{ $t('footer.link.fenjianli') }}</a>
        </a-flex>
      </a-flex>
    </div>
  </div>
</template>
<script setup>
  import { computed } from 'vue';
  import { useUserStore } from '/@/store/modules/system/user';
  import logoSub from '/@/assets/images/logo/logo-dark.png';

  const userStore = useUserStore();
  const siteConfig = computed(() => userStore.siteConfig);
  const logoUrl = computed(() => userStore.siteConfig?.logoImage?.imageUrl);
</script>

<style lang="less" scoped>
  .footer {
    width: 100%;
    height: 193px;
    background: rgba(225, 232, 237, 1);

    .wrap {
      max-width: 1440px;
      display: flex;
      margin: 0 auto;
      justify-content: space-between;
      padding: 24px;
      gap: 115px;
      width: 100%;
    }

    .logo {
      width: 115px;
      img {
        max-width: 100%;
      }
    }

    .title-sub {
      color: rgba(125, 140, 150, 0.5);
    }

    .desc {
      .title {
        color: rgba(65, 78, 87, 1);
        font-size: 14px;
      }
      span:not(.title) {
        color: rgba(125, 140, 150, 1);
        font-size: 12px;
      }
      .link-item {
        color: rgba(125, 140, 150, 1);
        font-size: 12px;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
