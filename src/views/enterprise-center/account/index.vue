<template>
  <a-flex style="height: 100%; overflow: hidden" vertical>
    <div class="borer-bottom">
      <content-head />
    </div>
    <div class="account-setting">
      <a-flex class="borer-bottom account-setting-space" align="center" gap="40">
        <span class="label">{{ getI18nLabel('rows.0') }}</span>
        <a-flex class="avatar-edit" gap="23">
          <input ref="avatarFileRef" type="file" accept="image/*" @change="handleUpload" class="upload-input" />
          <a-image style="border-radius: 4px" :src="form.avatar" :preview="false" width="112px" height="112px" />
          <a-flex vertical gap="10" justify="center" align="flex-start">
            <a-button style="padding: 0" type="link" size="small" @click="avatarFileRef.click()" class="mui-primary-text" :loading="avatarUploading">
              {{ getI18nLabel('avatar', 1) }}
            </a-button>
            <span class="mui-small-size mui-desc-text">{{ getI18nLabel('avatar', { num: 2 }, 2) }}</span>
          </a-flex>
        </a-flex>
        <a-flex gap="20" align="center">
          <m-form-item no-style :label="getI18nLabel('userInfo', 1)">
            <a-input :disabled="!formStatus.isNameEdit" :maxlength="15" v-model:value.trim="form.englishName" />
          </m-form-item>
          <a-button v-if="!formStatus.isNameEdit" @click="formStatus.isNameEdit = true" type="link" size="small">{{ $t('common.edit', 0) }}</a-button>
          <template v-else>
            <a-flex>
              <a-button @click="handleCancel('name')" type="link" size="small">{{ $t('common.edit', 2) }}</a-button>
              <a-button @click="handleSave('name')" type="link" size="small" :loading="buttonLoading.name">{{ $t('common.edit', 1) }}</a-button>
            </a-flex>
          </template>
        </a-flex>
        <a-flex gap="20" align="center" style="flex: 1">
          <div style="flex: 1">
            <m-form-item no-style :label="getI18nLabel('userInfo', 2)">
              <dictionary-select cascader type="job_category" :disabled="!formStatus.isJobEdit" :maxlength="15" v-model:value="form.position" />
            </m-form-item>
          </div>
          <a-button v-if="!formStatus.isJobEdit" @click="formStatus.isJobEdit = true" type="link" size="small">{{ $t('common.edit', 0) }}</a-button>
          <template v-else>
            <a-flex>
              <a-button @click="handleCancel('job')" type="link" size="small">{{ $t('common.edit', 2) }}</a-button>
              <a-button @click="handleSave('job')" type="link" size="small" :loading="buttonLoading.job">{{ $t('common.edit', 1) }}</a-button>
            </a-flex>
          </template>
        </a-flex>
      </a-flex>
      <a-flex class="borer-bottom account-setting-space" align="center" justify="space-between">
        <a-flex gap="40" align="center">
          <span class="label">{{ getI18nLabel('rows.2') }}</span>
          <span class="mui-warning-text mui-font-size-16">{{ getI18nLabel('password', 1) }}</span>
        </a-flex>
        <a-button type="link" size="small" @click="handleOpenPasswordModal">{{ getI18nLabel('password', 0) }}</a-button>
      </a-flex>
      <a-flex class="borer-bottom account-setting-space" align="center" justify="space-between">
        <a-flex gap="40" align="center">
          <span class="label">{{ getI18nLabel('rows.3') }}</span>
          <a-flex>
            <span class="mui-desc-text mui-font-size-16">{{ form.email || '--' }}</span>
            <span class="mui-warning-text mui-font-size-16">{{ getI18nLabel('email.0') }}</span>
          </a-flex>
        </a-flex>
        <a-flex gap="10">
          <a-button type="link" size="small" @click="emailModalRef?.handleOpen?.({ email: form.email })">{{ getI18nLabel('email.2') }}</a-button>
          <a-button type="link" size="small" @click="emailBindModalRef?.handleOpen?.({ email: form.email })">{{ getI18nLabel('email.3') }}</a-button>
        </a-flex>
      </a-flex>
    </div>
  </a-flex>
  <password-modal ref="passwordModalRef" :email="form.email" @success="handlePasswordUpdated" />
  <email-change-modal ref="emailModalRef" :current-email="form.email" @success="handleEmailUpdated" />
  <email-bind-modal ref="emailBindModalRef" :current-email="form.email" @success="handleEmailUpdated" />
  <image-cropper ref="cropperRef" @cropped="handleCropped" />
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import ContentHead from '../components/content-head.vue';
  import i18n from '/@/i18n';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import ImageCropper from '/@/components/support/image-cropper/image-cropper.vue';
  import PasswordModal from '/@/components/business/account/password-modal.vue';
  import EmailChangeModal from '/@/components/business/account/email-change-modal.vue';
  import EmailBindModal from '/@/components/business/account/email-bind-modal.vue';
  import { message } from 'ant-design-vue';
  import { AVATAR_ACCEPT_TYPES, AVATAR_MAX_SIZE_MB, useAccountSetting } from '/@/components/business/account/use-account-setting';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';

  const getI18nLabel = (name, ...arg) => i18n.global.t(`userCenter.content.accountSetting.${name}`, ...arg);

  const { form, snapshot, buttonLoading, avatarUploading, fetchAccountSettings, revertField, saveField, uploadAvatarFile } = useAccountSetting();

  const cropperRef = ref();
  const passwordModalRef = ref();
  const emailModalRef = ref();
  const emailBindModalRef = ref();

  const avatarFileRef = ref();

  const formStatus = reactive({
    isNameEdit: false,
    isJobEdit: false,
  });

  const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCropped = async (base64) => {
    const file = dataUrlToFile(base64, `avatar-${Date.now()}.png`);
    if (!file) return;
    await uploadAvatarFile(file);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!AVATAR_ACCEPT_TYPES.includes(file.type)) {
      message.warning(getI18nLabel('validation.avatarType'));
      e.target.value = '';
      return;
    }
    if (file.size > AVATAR_MAX_SIZE_MB * 1024 * 1024) {
      message.warning(getI18nLabel('validation.avatarSize', { size: AVATAR_MAX_SIZE_MB }));
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      cropperRef.value?.handleOpen(event.target?.result);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = (type) => {
    const map = {
      name: { key: 'englishName', statusKey: 'isNameEdit' },
      job: { key: 'position', statusKey: 'isJobEdit' },
    };
    const config = map[type];
    if (!config) return;
    revertField(config.key);
    formStatus[config.statusKey] = false;
  };

  const handleSave = async (type) => {
    const map = {
      name: {
        key: 'englishName',
        statusKey: 'isNameEdit',
        validateKey: 'validation.englishName',
      },
      job: {
        key: 'position',
        statusKey: 'isJobEdit',
        validateKey: 'validation.position',
      },
    };
    const config = map[type];
    if (!config) return;
    const value = (form[config.key] || '').trim();
    if (!value) {
      message.warning(getI18nLabel(config.validateKey));
      return;
    }
    if (value === snapshot.value[config.key]) {
      formStatus[config.statusKey] = false;
      form[config.key] = snapshot.value[config.key];
      return;
    }
    form[config.key] = value;
    const success = await saveField(type, { [config.key]: value });
    if (success) {
      formStatus[config.statusKey] = false;
    }
  };

  const handleOpenPasswordModal = () => {
    passwordModalRef.value?.handleOpen?.({
      email: form.email,
    });
  };

  const handlePasswordUpdated = () => {
    fetchAccountSettings();
  };

  const handleEmailUpdated = (email) => {
    if (email) {
      form.email = email;
      snapshot.value.email = email;
    }
    fetchAccountSettings();
  };

  onMounted(fetchAccountSettings);
</script>

<style scoped lang="less">
  .account-setting {
    .account-setting-space {
      padding: 20px 40px;
      min-height: 90px;
    }
    .label {
      font-size: 16px;
      width: 4em;
      flex-shrink: 0;
      color: @font-sub-color;
    }
  }
  .borer-bottom:not(:last-child) {
    border-bottom: 1px solid rgba(235, 236, 240, 1);
  }

  .avatar-edit {
    opacity: 1;
    border-radius: 4px;
    width: 283px;
    flex-shrink: 0;
    background: rgba(247, 247, 247, 1);
    padding: 8px 13px;

    .upload-input {
      visibility: hidden;
      width: 0;
      height: 0;
    }
  }
</style>
<route>
{
auth: 'accountSetting',
parentId: 'enterprise-center',
sort: 6
}
</route>
