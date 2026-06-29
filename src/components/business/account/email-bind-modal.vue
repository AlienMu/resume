<template>
  <a-modal
    width="420px"
    centered
    destroy-on-close
    :confirm-loading="submitting"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :title="$t('userCenter.content.accountSetting.modalName.2')"
    @ok="onOk"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="form" :rules="formRules" layout="vertical">
      <m-form-item :label="getFieldLabel('email')" name="email">
        <a-input disabled v-model:value.trim="form.email" :placeholder="getPlaceholder('email')" />
      </m-form-item>

      <a-flex gap="12" align="flex-start">
        <div class="flex-1">
          <m-form-item :label="getFieldLabel('code')" name="emailCode">
            <a-input v-model:value.trim="form.emailCode" :placeholder="getPlaceholder('code')" />
          </m-form-item>
        </div>
        <a-button class="send-button" type="link" :loading="sendCodeLoading" @click="handleSendCode" :disabled="sendCodeCountdown > 0">
          {{ sendCodeCountdown > 0 ? `${sendCodeCountdown}s` : getSendCodeLabel() }}
        </a-button>
      </a-flex>
    </a-form>
  </a-modal>
</template>

<script setup>
  import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue';
  import { message } from 'ant-design-vue';
  import i18n from '/@/i18n';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { bindEmailWithCaptcha, generateEmailBindCaptcha, sendBindEmailCode, sendEmailVerifyCode, verifyEmail } from '/@/api/account';

  const FORM_PATH = 'userCenter.content.accountSetting';
  const MODAL_KEY = 'emailBind';

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
  const sendCodeLoading = ref(false);
  const sendCodeCountdown = ref(0);
  const formRef = ref();
  const form = reactive({
    email: '',
    emailCode: '',
    captcha: '',
  });
  const captcha = reactive({
    key: '',
    image: '',
  });

  let sendCodeTimer = null;

  const formatCaptchaImage = (value) => {
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('http')) return value;
    return `data:image/png;base64,${value}`;
  };

  const resetForm = (payload = {}) => {
    form.email = payload.email ?? '';
    form.emailCode = '';
    form.captcha = '';
    nextTick(() => formRef.value?.clearValidate?.());
  };

  const clearCountdown = () => {
    if (sendCodeTimer) {
      clearInterval(sendCodeTimer);
      sendCodeTimer = null;
    }
    sendCodeCountdown.value = 0;
  };

  const startCountdown = () => {
    clearCountdown();
    sendCodeCountdown.value = 60;
    sendCodeTimer = setInterval(() => {
      if (sendCodeCountdown.value <= 1) {
        clearCountdown();
        return;
      }
      sendCodeCountdown.value -= 1;
    }, 1000);
  };

  const handleClose = () => {
    isOpen.value = false;
    nextTick(() => formRef.value?.clearValidate?.());
  };

  const handleOpen = (payload = {}) => {
    resetForm({
      email: payload.email ?? props.currentEmail ?? '',
    });
    isOpen.value = true;
  };

  watch(
    () => props.currentEmail,
    (value) => {
      if (!isOpen.value) {
        form.email = value || '';
      }
    }
  );

  const handleSendCode = async () => {
    sendCodeLoading.value = true;
    try {
      await sendEmailVerifyCode({ email: form.email.trim() });
      message.success(getModalMessage('sendCodeSuccess'));
      startCountdown();
    } finally {
      sendCodeLoading.value = false;
    }
  };

  const validateEmailFormat = (_rule, value) => {
    if (!value) {
      return Promise.reject(getValidationLabel('emailRequired'));
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(value)) {
      return Promise.reject(getValidationLabel('emailRequired'));
    }
    return Promise.resolve();
  };

  const formRules = {
    email: [{ validator: validateEmailFormat, trigger: ['blur', 'change'] }],
    emailCode: [{ required: true, message: getValidationLabel('emailCodeRequired'), trigger: 'blur' }],
  };

  const onOk = async () => {
    submitting.value = true;
    try {
      await formRef.value?.validate?.();
      await verifyEmail({
        email: form.email.trim(),
        code: form.emailCode.trim(),
      });
      message.success(getModalMessage('emailVerifySuccess'));
      emit('success', form.email.trim());
      handleClose();
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
    border-radius: 4px;
    overflow: hidden;
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
