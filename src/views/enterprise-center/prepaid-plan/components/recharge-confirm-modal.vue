<template>
  <a-modal
    width="440px"
    :title="getLabel('title')"
    wrap-class-name="mui-modal"
    v-model:open="isOpen"
    :confirm-loading="submitLoading"
    :ok-text="getCommon('modal.ok')"
    :cancel-text="getCommon('modal.cancel')"
    centered
    :footer="null"
    @cancel="handleClose"
    @close="handleClose"
  >
    <div class="recharge-confirm-content">
      <div class="amount-display">
        <div class="amount-value">{{ amount }}</div>
        <div class="amount-desc">{{ getLabel('amountDesc') }}</div>
      </div>

      <div class="qrcode-section" v-if="paymentInfo.qrcodeUrl">
        <a-image width="100px" :src="paymentInfo.qrcodeUrl" :preview="true" class="qrcode-image" />
      </div>

      <a-flex align="center" gap="10" class="address-section">
        <div class="address-label">{{ getLabel('recipientAddress') }}</div>
        <div class="address-content">
          <span class="address-text">{{ paymentInfo.address || '-' }}</span>
          <a-button type="link" size="small" @click="handleCopyAddress" class="copy-button">
            {{ getLabel('copy') }}
          </a-button>
        </div>
      </a-flex>

      <a-flex align="center" gap="10" class="network-section">
        <div class="network-label">{{ getLabel('mainnet') }}</div>
        <div class="network-value">{{ getLabel('networkType') }}</div>
      </a-flex>

      <a-form ref="formRef" :model="form" :rules="rules" class="upload-form">
        <div class="mui-font-size-20 text-center" style="margin-bottom: 10px">{{ getLabel('uploadScreenshot') }}</div>
        <a-form-item name="paymentVoucher">
          <m-upload v-model:files="form.paymentVoucher" :max-size="0.5" accept="jpg,png" :max-upload-size="1" class="payment-upload" />
        </a-form-item>
      </a-form>

      <a-button type="primary" :loading="submitLoading" @click="handleSubmit" class="confirm-button" block>
        {{ getLabel('confirmPayment') }}
      </a-button>

      <div class="notice-section text-center">
        <div class="notice-text">{{ getLabel('notice.0') }}</div>
        <div class="notice-text">{{ getLabel('notice.1') }}</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { completePayment } from '/@/api/company';
  import MUpload from '/@/components/mui/m-upload/m-upload.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel, getCommon } = useI18nText({ local: 'enterpriseCenter.prepaidPlan.rechargeConfirm' });
  const userStore = useUserStore();

  const formRef = ref();
  const isOpen = ref(false);
  const submitLoading = ref(false);
  const orderNo = ref('');
  const amount = ref('');

  const paymentInfo = computed(() => userStore.siteConfig?.paymentAddressInfo || {});

  const form = reactive({
    paymentVoucher: [],
  });

  const rules = {
    paymentVoucher: [
      {
        validator: async () => {
          if (!form.paymentVoucher.length) {
            throw new Error(getLabel('rules.paymentVoucherRequired'));
          }
        },
        trigger: ['change'],
      },
    ],
  };

  const emit = defineEmits(['success']);

  const resetForm = () => {
    form.paymentVoucher = [];
    formRef.value?.clearValidate();
  };

  const handleClose = () => {
    isOpen.value = false;
    submitLoading.value = false;
    resetForm();
  };

  const handleCopyAddress = async () => {
    if (!paymentInfo.value.address) {
      return;
    }
    try {
      await navigator.clipboard.writeText(paymentInfo.value.address);
      message.success(getLabel('copySuccess'));
    } catch (error) {
      // catch 不弹出消息
    }
  };

  const handleSubmit = async () => {
    try {
      submitLoading.value = true;
      const values = await formRef.value.validate();
      const payload = {
        orderNo: orderNo.value,
        paymentVoucher: form.paymentVoucher?.[0]?.url ?? '',
      };
      await completePayment(payload);
      message.success(getLabel('message.success'));
      emit('success');
      handleClose();
    } catch (error) {
      if (error?.errorFields?.length) {
        submitLoading.value = false;
        return;
      }
      submitLoading.value = false;
      // catch 不弹出消息
    } finally {
      submitLoading.value = false;
    }
  };

  const handleOpen = ({ orderNo: no = '', amount: amt = '' } = {}) => {
    resetForm();
    console.log('ok');
    orderNo.value = no;
    amount.value = amt;
    isOpen.value = true;
  };

  defineExpose({
    handleOpen,
  });
</script>

<style scoped lang="less">
  .recharge-confirm-content {
    .amount-display {
      text-align: center;

      .amount-value {
        font-size: 28px;
        font-weight: 700;
        color: @font-primary-color;
        margin-bottom: 10px;
      }

      .amount-desc {
        font-size: 14px;
        color: @font-desc-color;
      }
    }

    .qrcode-section {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;

      .qrcode-image {
        width: 200px;
        height: 200px;
      }
    }

    .address-section {
      .address-label {
        font-size: 14px;
        color: @font-sub-color;
        flex-shrink: 0;
      }

      .address-content {
        display: flex;
        align-items: center;
        gap: 10px;

        .address-text {
          flex: 1 1 auto;
          font-size: 12px;
          font-weight: 700;
          color: @font-primary-color;
          word-break: break-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-button {
          flex-shrink: 0;
          padding: 0;
        }
      }
    }

    .network-section {
      margin-bottom: 30px;

      .network-label {
        font-size: 14px;
        color: @font-sub-color;
      }

      .network-value {
        font-size: 12px;
        font-weight: 700;
        color: @font-primary-color;
      }
    }

    .upload-form {
      margin-bottom: 20px;

      .payment-upload {
        margin-bottom: 8px;
      }

      .upload-tips {
        font-size: 12px;
        color: @font-tip-color;
        margin-top: 8px;
      }
    }

    .confirm-button {
      margin-bottom: 20px;
      height: 40px;
    }

    .notice-section {
      .notice-text {
        font-size: 12px;
        color: @error-color;
        line-height: 1.6;
      }
    }
  }
</style>
