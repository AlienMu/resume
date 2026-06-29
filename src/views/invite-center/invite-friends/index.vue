<template>
  <a-flex vertical gap="30" class="invite-friends">
    <div class="banner"><img :src="invitationBannerImage" alt="" /></div>
    <a-flex justify="space-between" align="center" class="invite-friends-share">
      <a-flex vertical gap="12">
        <a-flex gap="14">
          <span class="mui-sub-text">{{ getLabel('share', 1) }}</span>
          <span class="mui-bold mui-title-text">{{ shareLink }}</span>
        </a-flex>
        <a-flex gap="14" align="center">
          <span style="width: 6em" class="mui-sub-text">{{ getLabel('share', 2) }}</span>
          <a-typography-text
            class="mui-bold mui-title-text"
            :content="inviteCode || '-'"
            :copyable="inviteCode ? { text: inviteCode, onCopy: handleCopyCode } : false"
          />
        </a-flex>
      </a-flex>
      <a-button type="primary" :loading="isLoading" @click="handleCopyLink">{{ getLabel('button') }}</a-button>
      <a-flex v-if="!canInvite" vertical align="center" justify="center" class="mask" gap="10">
        <strong v-html="getLabel('mask', 1)"></strong>
        <span class="mui-title-text">{{ getLabel('mask', 2) }}</span>
      </a-flex>
    </a-flex>
    <a-flex vertical gap="16" class="tips">
      <a-flex gap="5" align="center">
        <a-image :src="BookImage" width="21px" :preview="false" />
        <strong>{{ getLabel('tips.0') }}</strong>
      </a-flex>
      <a-flex gap="8" vertical>
        <p>{{ getLabel('tips.1') }}</p>
        <p v-html="getLabel('tips.2')"></p>
        <p>{{ getLabel('tips.3') }}</p>
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import BannerImage from '/@/assets/images/invite/banner.png';
  import BookImage from '/@/assets/images/invite/book.png';
  import { getMyInviteCode } from '/@/api/invite';
  import { useClipboard } from '@vueuse/core';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel } = useI18nText({ local: 'inviteCenter.inviteFriends' });
  const userStore = useUserStore();

  const inviteCode = ref('');
  const invitationBannerImage = computed(() => userStore.invitationImageUrl || BannerImage);

  const { copy } = useClipboard({
    legacy: true,
  });

  const isLoading = ref(false);

  const shareLink = computed(() => {
    const code = inviteCode.value?.trim();
    const origin = window.location?.origin || '';
    return code ? `${origin}/login?key=invite&code=${code}` : '-';
  });

  const canInvite = computed(() => Boolean(inviteCode.value));

  const copyText = async (text, successMessage) => {
    if (!text) {
      message.warning(getLabel('loadFailed'));
      return;
    }
    try {
      await copy(text);
      message.success(successMessage);
    } catch (error) {
      message.error(error?.message || getLabel('copyFailed'));
    }
  };

  const handleCopyLink = () => {
    const randomIndex = Math.floor(Math.random() * 3);
    const selectedMessage = getLabel(`shareMessages[${randomIndex}]`, { link: shareLink.value });
    copyText(selectedMessage, getLabel('copyLinkSuccess'));
  };
  const handleCopyCode = () => copyText(inviteCode.value, getLabel('copyCodeSuccess'));

  const fetchInviteCode = async () => {
    try {
      isLoading.value = true;
      const data = await getMyInviteCode();
      inviteCode.value = data ?? '';
    } finally {
      message.destroy();
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    fetchInviteCode();
  });
</script>

<style scoped lang="less">
  .invite-friends {
    padding: 20px;
    .banner {
      img {
        width: 100%;
      }
    }
    .invite-friends-share {
      width: 830px;
      margin: 0 auto;
      border: 1px solid @border-color;
      border-radius: 4px;
      padding: 30px;
      position: relative;

      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(235, 235, 235, 0.5);
        backdrop-filter: blur(8px);
        z-index: 2;
        strong {
          font-size: 24px;
          color: @font-primary-color;
          :deep(b) {
            color: @primary-color;
          }
        }
      }
    }

    .tips {
      padding-left: 20px;
      margin-bottom: 20px;
      strong {
        font-size: 16px;
        color: @font-primary-color;
      }
      p {
        margin-bottom: 0;
        color: @font-desc-color;
      }
    }
  }
</style>
<route>
{
auth: 'inviteFriends',
parentId: 'invite-center',
sort: 3
}
</route>
