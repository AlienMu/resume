<!--
  * 头像
  *
-->

<template>
  <a-dropdown class="header-trigger" :get-popup-container="getPopupContainer">
    <div class="wrapper">
      <a-avatar class="avatar" :src="userInfo.avatar">{{ loginName }}</a-avatar>
      <span class="name">{{ loginName }}</span>
    </div>
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item @click="toAccount()">
          <span>{{ userCenterLabel }}</span>
        </a-menu-item>
        <a-menu-item @click="onLogout">
          <span>{{ getLabel('logout') }}</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <HeaderResetPassword v-model:display="visible" @onLogout="onLogout" />
</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/system/user';
  import HeaderResetPassword from './header-reset-password-modal/index.vue';
  import { useRouter } from 'vue-router';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { USER_TYPE_ENUM } from '/@/constants/api-const';
  import i18n from '/@/i18n';

  const userInfo = useUserStore();

  const { getLabel } = useI18nText({ local: 'layout' });

  // 根据用户类型获取对应的中心名称
  const userCenterLabel = computed(() => {
    switch (userInfo.userType) {
      case USER_TYPE_ENUM.PERSON.value:
        return i18n.global.t('userCenter.sidePanel.title');
      case USER_TYPE_ENUM.COMPANY.value:
        return i18n.global.t('enterpriseCenter.sidePanel.title');
      case USER_TYPE_ENUM.INVITED.value:
        return i18n.global.t('inviteCenter.sidePanel.title');
      default:
        return getLabel('userCenter');
    }
  });

  // 头像背景颜色
  const AVATAR_BACKGROUND_COLOR_ARRAY = ['#87d068', '#00B853', '#f56a00', '#1890ff'];

  const visible = ref(false);

  //监听退出登录方法
  async function onLogout() {
    userInfo.logout();
    location.href = '/';
  }
  function modifyPassWord() {
    visible.value = true;
  }

  // ------------------------ 个人中心 ------------------------
  const router = useRouter();

  const toAccount = () => {
    let url = '';
    switch (userInfo.userType) {
      case USER_TYPE_ENUM.PERSON.value:
        url = router.resolve({ name: 'user-center' }).href;
        break;
      case USER_TYPE_ENUM.COMPANY.value:
        url = router.resolve({ name: 'enterprise-center' }).href;
        break;
      case USER_TYPE_ENUM.INVITED.value:
        url = router.resolve({ name: 'invite-center' }).href;
        break;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  function getPopupContainer() {
    return document.body;
  }

  // ------------------------ 以下是 头像和姓名 相关 ------------------------

  const avatarName = ref('');

  const loginName = computed(() => userInfo.loginName);

  // 更新头像信息
  function updateAvatar() {
    if (userInfo.actualName) {
      avatarName.value = userInfo.actualName.substr(0, 1);
      const avatar = document.getElementById('muiAdminAvatar');
      if (avatar) {
        avatar.style.backgroundColor = AVATAR_BACKGROUND_COLOR_ARRAY[hashcode(avatarName.value) % 4];
      }
    }
  }

  /**
   * 通过计算固定字符串的hash，来选择颜色，这也每次登录的颜色是相同的
   */
  function hashcode(str) {
    let hash = 1,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  onMounted(updateAvatar);
</script>
<style lang="less" scoped>
  .wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;

    .avatar {
      vertical-align: middle;
      width: 28px;
      height: 28px;
      line-height: 28px;
      border-radius: 28px;
      background: @primary-color;
      overflow: hidden;
      img {
        max-width: 100%;
      }
    }

    .name {
      margin-left: 8px;
      font-weight: 400;
    }
  }

  .header-trigger {
    height: @header-user-height;
    line-height: @header-user-height;
    margin-right: 20px;
  }
</style>
