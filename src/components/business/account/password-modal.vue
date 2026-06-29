<template>
  <a-modal
    width="480px"
    centered
    destroy-on-close
    :confirm-loading="submitting"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :title="$t('userCenter.content.accountSetting.modalName.0')"
    @ok="onOk"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="form" :rules="formRules" layout="vertical">
      <m-form-item :label="getFieldLabel('email')" name="email">
        <a-input v-model:value.trim="form.email" :placeholder="getPlaceholder('email')" disabled />
      </m-form-item>

      <a-flex gap="12" align="flex-start">
        <div class="flex-1">
          <m-form-item :label="getFieldLabel('emailCode')" name="emailCode">
            <a-input v-model:value.trim="form.emailCode" :placeholder="getPlaceholder('emailCode')" />
          </m-form-item>
        </div>
        <a-button class="send-button" type="link" :loading="sendCodeLoading" @click="handleSendCode" :disabled="sendCodeCountdown > 0">
          {{ sendCodeCountdown > 0 ? `${sendCodeCountdown}s` : getSendCodeLabel() }}
        </a-button>
      </a-flex>

      <m-form-item :label="getFieldLabel('newPassword')" name="newPassword">
        <a-input-password v-model:value.trim="form.newPassword" :placeholder="getPlaceholder('newPassword')" />
      </m-form-item>
      <m-form-item :label="getFieldLabel('confirmPassword')" name="confirmPassword">
        <a-input-password v-model:value.trim="form.confirmPassword" :placeholder="getPlaceholder('confirmPassword')" />
      </m-form-item>
      <a-flex gap="12">
        <div class="flex-1">
          <m-form-item :label="getFieldLabel('captcha')" name="captcha">
            <a-input v-model:value.trim="form.captcha" :placeholder="getPlaceholder('captcha')" />
          </m-form-item>
        </div>
        <a-image :preview="false" class="mui-message-code" :src="captcha.image" />
      </a-flex>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { message } from 'ant-design-vue';
  import i18n from '/@/i18n';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { changePassword, generatePasswordCaptcha, sendPasswordChangeEmailCode } from '/@/api/account';

  const FORM_PATH = 'userCenter.content.accountSetting';
  const MODAL_KEY = 'pass';

  const props = defineProps({
    email: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['success']);

  const getFieldLabel = (field) => i18n.global.t(`${FORM_PATH}.modalForm.${MODAL_KEY}.${field}`);
  const getPlaceholder = (field) => i18n.global.t(`${FORM_PATH}.modalPlaceholder.input`, { name: getFieldLabel(field) });
  const getSendCodeLabel = () => i18n.global.t(`${FORM_PATH}.modalButtons.sendCode`);
  const getModalMessage = (key) => i18n.global.t(`${FORM_PATH}.modalMessages.${key}`);
  const getValidationLabel = (key, payload) => i18n.global.t(`${FORM_PATH}.validation.modal.${key}`, payload);
  const getCaptchaPlaceholder = () => i18n.global.t(`${FORM_PATH}.modalPlaceholder.captcha`) || 'Click to refresh';

  const isOpen = ref(false);
  const submitting = ref(false);
  const sendCodeLoading = ref(false);
  const sendCodeCountdown = ref(0);
  const formRef = ref();
  const form = reactive({
    email: '',
    captcha: '',
    emailCode: '',
    newPassword: '',
    confirmPassword: '',
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
    form.email = payload.email ?? '';
    form.captcha = '';
    form.emailCode = '';
    form.newPassword = '';
    form.confirmPassword = '';
    nextTick(() => formRef.value?.clearValidate?.());
  };

  const clearCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    sendCodeCountdown.value = 0;
  };

  const startCountdown = () => {
    clearCountdown();
    sendCodeCountdown.value = 60;
    countdownTimer = setInterval(() => {
      if (sendCodeCountdown.value <= 1) {
        clearCountdown();
        return;
      }
      sendCodeCountdown.value -= 1;
    }, 1000);
  };

  const handleRefreshCaptcha = async () => {
    try {
      const data = await generatePasswordCaptcha();
      captcha.key = data?.captchaKey || data?.key || data?.captchaId || '';
      captcha.image = formatCaptchaImage(data?.captchaImage || data?.image || data?.img || '');
      if (!captcha.key || !captcha.image) {
        throw new Error('captcha missing');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (payload = {}) => {
    resetForm({
      email: payload.email ?? props.email ?? '',
    });
    isOpen.value = true;
    handleRefreshCaptcha();
  };

  const handleClose = () => {
    isOpen.value = false;
    nextTick(() => formRef.value?.clearValidate?.());
  };

  watch(
    () => props.email,
    (value) => {
      if (!isOpen.value) {
        form.email = value || '';
      }
    }
  );

  const handleSendCode = async () => {
    if (!form.email?.trim()) {
      message.warning(getValidationLabel('emailRequired'));
      return;
    }
    sendCodeLoading.value = true;
    try {
      await sendPasswordChangeEmailCode({ email: form.email.trim() });
      message.success(getModalMessage('sendCodeSuccess'));
      startCountdown();
    } finally {
      sendCodeLoading.value = false;
    }
  };

  const validateStrongPassword = (_rule, value) => {
    if (!value) {
      return Promise.reject(getValidationLabel('passwordRequired'));
    }
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!reg.test(value)) {
      return Promise.reject(getValidationLabel('passwordValid', { num: 6 }));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_rule, value) => {
    if (!value) {
      return Promise.reject(getValidationLabel('confirmPasswordRequired'));
    }
    if (value !== form.newPassword) {
      return Promise.reject(getValidationLabel('passwordMismatch'));
    }
    return Promise.resolve();
  };

  const formRules = {
    email: [{ required: true, message: getValidationLabel('emailRequired'), trigger: 'blur' }],
    captcha: [{ required: true, message: getValidationLabel('captchaRequired'), trigger: 'blur' }],
    emailCode: [{ required: true, message: getValidationLabel('emailCodeRequired'), trigger: 'blur' }],
    newPassword: [{ validator: validateStrongPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: ['blur', 'change'] }],
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
      await changePassword({
        email: form.email.trim(),
        emailCode: form.emailCode.trim(),
        newPassword: form.newPassword,
        captcha: form.captcha.trim(),
        captchaKey: captcha.key,
      });
      message.success(getModalMessage('passwordUpdateSuccess'));
      emit('success');
      handleClose();
    } catch (error) {
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
    align-self: flex-start;
    padding: 8px 0;
  }
  .captcha-box {
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
