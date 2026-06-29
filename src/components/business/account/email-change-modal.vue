<template>
  <a-modal
    width="440px"
    centered
    destroy-on-close
    :confirm-loading="submitting"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :title="$t('userCenter.content.accountSetting.modalName.1')"
    @ok="onOk"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="form" :rules="formRules" layout="vertical">
      <m-form-item :label="getFieldLabel('oldEmail')" name="oldEmail">
        <a-input v-model:value.trim="form.oldEmail" :placeholder="getPlaceholder('oldEmail')" disabled />
      </m-form-item>

      <a-flex gap="12" align="flex-start">
        <div class="flex-1">
          <m-form-item :label="getFieldLabel('oldEmailCode')" name="oldEmailCode">
            <a-input v-model:value.trim="form.oldEmailCode" :placeholder="getPlaceholder('oldEmailCode')" />
          </m-form-item>
        </div>
        <a-button class="send-button" type="link" :loading="sendOldCodeLoading" @click="handleSendOldEmailCode" :disabled="sendOldCodeCountdown > 0">
          {{ sendOldCodeCountdown > 0 ? `${sendOldCodeCountdown}s` : getSendCodeLabel() }}
        </a-button>
      </a-flex>

      <m-form-item :label="getFieldLabel('newEmail')" name="newEmail">
        <a-input v-model:value.trim="form.newEmail" :placeholder="getPlaceholder('newEmail')" />
      </m-form-item>

      <a-flex gap="12" align="flex-start">
        <m-form-item class="flex-1" :label="getFieldLabel('captcha')" name="captcha">
          <a-input v-model:value.trim="form.captcha" :placeholder="getPlaceholder('captcha')" />
        </m-form-item>
        <div class="captcha-box" role="button" tabindex="0" @click="handleRefreshCaptcha">
          <a-image :preview="false" class="mui-message-code" :src="captcha.image" />
          <span v-if="!captcha.image" class="captcha-placeholder">{{ getCaptchaPlaceholder() }}</span>
        </div>
      </a-flex>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { message } from 'ant-design-vue';
  import i18n from '/@/i18n';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { changeEmail, generateEmailChangeCaptcha, sendOldEmailCode } from '/@/api/account';

  const FORM_PATH = 'userCenter.content.accountSetting';
  const MODAL_KEY = 'emailChange';

  const props = defineProps({
    currentEmail: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['success']);

  const getFieldLabel = (field) => i18n.global.t(`${FORM_PATH}.modalForm.${MODAL_KEY}.${field}`);
  const getPlaceholder = (field) => i18n.global.t(`${FORM_PATH}.modalPlaceholder.input`, { name: getFieldLabel(field) });
  const getSendCodeLabel = () => i18n.global.t(`${FORM_PATH}.modalButtons.sendCode`);
  const getModalMessage = (key) => i18n.global.t(`${FORM_PATH}.modalMessages.${key}`);
  const getValidationLabel = (key) => i18n.global.t(`${FORM_PATH}.validation.modal.${key}`);
  const getCaptchaPlaceholder = () => i18n.global.t(`${FORM_PATH}.modalPlaceholder.captcha`) || 'Click to refresh';

  const isOpen = ref(false);
  const submitting = ref(false);
  const sendOldCodeLoading = ref(false);
  const sendOldCodeCountdown = ref(0);
  const formRef = ref();
  const form = reactive({
    oldEmail: '',
    oldEmailCode: '',
    newEmail: '',
    captcha: '',
  });
  const captcha = reactive({
    key: '',
    image: '',
  });

  let countdownTimer = null;

  const formatCaptchaImage = (value) => {
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('http')) return value;
    return `data:image/png;base64,${value}`;
  };

  const resetForm = (payload = {}) => {
    form.oldEmail = payload.email ?? '';
    form.oldEmailCode = '';
    form.newEmail = '';
    form.captcha = '';
    nextTick(() => formRef.value?.clearValidate?.());
  };

  const clearCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    sendOldCodeCountdown.value = 0;
  };

  const startCountdown = () => {
    clearCountdown();
    sendOldCodeCountdown.value = 60;
    countdownTimer = setInterval(() => {
      if (sendOldCodeCountdown.value <= 1) {
        clearCountdown();
        return;
      }
      sendOldCodeCountdown.value -= 1;
    }, 1000);
  };

  const ensureCaptcha = () => {
    if (!captcha.key || !captcha.image) {
      handleRefreshCaptcha();
    }
  };

  const handleRefreshCaptcha = async () => {
    try {
      const data = await generateEmailChangeCaptcha();
      captcha.key = data?.captchaKey || data?.key || data?.captchaId || '';
      captcha.image = formatCaptchaImage(data?.captchaImage || data?.image || data?.img || '');
      if (!captcha.key || !captcha.image) {
        throw new Error('captcha missing');
      }
    } catch (error) {
      message.error(getModalMessage('captchaLoadFailed') || 'Failed to load captcha');
    }
  };

  const handleOpen = (payload = {}) => {
    resetForm({
      email: payload.email ?? props.currentEmail ?? '',
    });
    isOpen.value = true;
    ensureCaptcha();
  };

  const handleClose = () => {
    isOpen.value = false;
    nextTick(() => formRef.value?.clearValidate?.());
  };

  watch(
    () => props.currentEmail,
    (value) => {
      if (!isOpen.value) {
        form.oldEmail = value || '';
      }
    }
  );

  const handleSendOldEmailCode = async () => {
    if (!form.oldEmail?.trim()) {
      message.warning(getValidationLabel('oldEmailRequired'));
      return;
    }
    sendOldCodeLoading.value = true;
    try {
      await sendOldEmailCode({ email: form.oldEmail.trim() });
      message.success(getModalMessage('sendCodeSuccess'));
      startCountdown();
    } catch (error) {
      message.error(error?.message || getModalMessage('sendCodeFailed'));
    } finally {
      sendOldCodeLoading.value = false;
    }
  };

  const validateEmailFormat = (_rule, value) => {
    if (!value) {
      return Promise.reject(getValidationLabel('newEmailRequired'));
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(value)) {
      return Promise.reject(getValidationLabel('newEmailRequired'));
    }
    if (value === form.oldEmail) {
      return Promise.reject(getValidationLabel('newEmailDiffRequired'));
    }
    return Promise.resolve();
  };

  const formRules = {
    oldEmail: [{ required: true, message: getValidationLabel('oldEmailRequired'), trigger: 'blur' }],
    oldEmailCode: [{ required: true, message: getValidationLabel('oldEmailCodeRequired'), trigger: 'blur' }],
    newEmail: [{ validator: validateEmailFormat, trigger: ['blur', 'change'] }],
    captcha: [{ required: true, message: getValidationLabel('captchaRequired'), trigger: 'blur' }],
  };

  const onOk = async () => {
    try {
      await formRef.value?.validate?.();
      if (!captcha.key) {
        await handleRefreshCaptcha();
        if (!captcha.key) {
          message.warning(getValidationLabel('captchaRequired'));
          return;
        }
      }
    } catch (error) {
      return;
    }
    submitting.value = true;
    try {
      await changeEmail({
        oldEmail: form.oldEmail.trim(),
        oldEmailCode: form.oldEmailCode.trim(),
        newEmail: form.newEmail.trim(),
        captcha: form.captcha.trim(),
        captchaKey: captcha.key,
      });
      message.success(getModalMessage('emailUpdateSuccess'));
      emit('success', form.newEmail.trim());
      handleClose();
    } catch (error) {
      message.error(error?.message || getModalMessage('emailUpdateFailed'));
      handleRefreshCaptcha();
    } finally {
      submitting.value = false;
    }
  };

  onBeforeUnmount(() => {
    clearCountdown();
  });

  defineExpose({
    handleOpen,
  });
</script>

<style scoped lang="less">
  .flex-1 {
    flex: 1;
  }
  .send-button {
    padding: 6px 0;
  }
  .captcha-box {
    width: 110px;
    height: 42px;
    border: 1px solid rgba(235, 236, 240, 1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .captcha-placeholder {
      color: #8c8c8c;
      font-size: 12px;
    }
  }
</style>
