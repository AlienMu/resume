<template>
  <a-modal
    width="600px"
    :title="getLabel('title')"
    wrap-class-name="mui-modal"
    v-model:open="isOpen"
    :confirm-loading="submitLoading"
    :ok-text="getCommon('modal.ok')"
    :cancel-text="getCommon('modal.cancel')"
    centered
    @cancel="handleClose"
    @close="handleClose"
    @ok="handleSubmit"
  >
    <a-form layout="vertical" ref="formRef" :model="form" :rules="rules">
      <a-form-item :label="getFieldLabel('amount')" required name="amount">
        <a-input-number :max="999999" :precision="0" style="width: 100%" :controls="false" v-model:value.trim="form.amount" :placeholder="getPlaceholderText('amount')" min="0" />
      </a-form-item>
      <a-form-item :label="getFieldLabel('arrivalAmount')" name="arrivalAmount">
        <a-input :value="arrivalAmountText" disabled />
      </a-form-item>
      <a-form-item :label="getFieldLabel('accountType')" name="accountType">
        <a-select v-model:value="form.accountType" :options="accountTypeOptions" disabled />
      </a-form-item>
      <a-form-item :label="getFieldLabel('walletAddress')" name="walletAddress" required>
        <a-input v-model:value.trim="form.walletAddress" :placeholder="getPlaceholderText('walletAddress')" />
      </a-form-item>
      <a-form-item :label="getFieldLabel('qrcodeUrl')" name="qrcodeUrl">
        <m-upload-card v-model:files="form.qrcodeUrl" :max-size="0.5" accept="jpg,png,bmp,jpeg" :max-upload-size="1" />
      </a-form-item>
    </a-form>
    <p class="withdraw-notice mui-tip-text">{{ getLabel('notice') }}</p>
    <template #footer>
      <a-button @click="handleClose">{{ getCommon('modal.cancel') }}</a-button>
      <a-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ getLabel('submitText') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { applyWithdraw } from '/@/api/invite';
  import MUpload from '/@/components/mui/m-upload/m-upload.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import MUploadCard from '/@/components/mui/m-upload-card/m-upload-card.vue';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel, getCommon } = useI18nText({ local: 'inviteCenter.myIncome.withdrawApply' });

  const getFieldLabel = (field) => getLabel(`fields.${field}`);
  const getPlaceholderText = (field) => getLabel(`placeholders.${field}`);

  const userStore = useUserStore();

  const formRef = ref();
  const isOpen = ref(false);
  const submitLoading = ref(false);

  const form = reactive({
    orderNo: '',
    amount: '',
    accountType: 'TRC20',
    walletAddress: '',
    qrcodeUrl: [], // File upload component returns an array
  });

  // Get the fee rate from store and convert to decimal (assumes it is stored as an integer percentage)
  const feeRate = computed(() => {
    const rate = Number(userStore.siteConfig.withdrawFeeRate);
    return rate / 100;
  });
  const availableAmount = ref(0);

  const accountTypeOptions = computed(() => [
    {
      label: getLabel('accountTypeOptions.tron'),
      value: 'TRC20',
    },
  ]);

  const arrivalAmount = computed(() => {
    const amount = Number(form.amount);
    if (!amount || Number.isNaN(amount)) {
      return '';
    }
    const result = amount * (1 - feeRate.value);
    return result > 0 ? result.toFixed(2) : '';
  });

  const feePercentage = computed(() => (feeRate.value * 100).toFixed(0));

  const arrivalAmountText = computed(() => {
    if (!arrivalAmount.value) {
      return '-';
    }
    const desc = getLabel('arrivalDesc', { fee: feePercentage.value });
    return `${arrivalAmount.value} (${desc})`;
  });

  const rules = {
    amount: [
      {
        validator: async (_, value) => {
          const numberValue = Number(value);
          if(!value) {
            return Promise.resolve();
          }
          if ( Number.isNaN(numberValue) || numberValue <= 0) {
            throw new Error(getLabel('rules.amountInvalid'));
          }
          if (availableAmount.value && numberValue > availableAmount.value) {
            throw new Error(getLabel('rules.amountExceed', { amount: availableAmount.value }));
          }
        },
        trigger: ['change'],
      },
    ],
    walletAddress: [
      {
        required: true,
        message: getLabel('rules.walletAddressRequired'),
        trigger: ['blur', 'change'],
      },
      {
        pattern: /^[A-Za-z0-9]+$/,
        message: getLabel('rules.walletAddressInvalid'),
        trigger: ['blur', 'change'],
      },
    ],
    qrcodeUrl: [
      {
        validator: async () => {
          // qrcodeUrl is optional, no required validation needed
        },
        trigger: ['change'],
      },
    ],
  };

  const emit = defineEmits(['success']);

  const resetForm = () => {
    form.orderNo = '';
    form.amount = '';
    form.accountType = 'TRC20';
    form.walletAddress = '';
    form.qrcodeUrl = [];
    formRef.value?.clearValidate();
  };

  const handleClose = () => {
    isOpen.value = false;
    submitLoading.value = false;
    resetForm();
  };

  const handleSubmit = async () => {
    try {
      submitLoading.value = true;
      const values = await formRef.value.validate();
      const payload = {
        amount: Number(values.amount),
        walletAddress: form.walletAddress,
        accountType: form.accountType,
        ...(form.qrcodeUrl && form.qrcodeUrl.length > 0 && { qrcodeUrl: form.qrcodeUrl[0]?.url ?? '' }),
      };
      await applyWithdraw(payload);
      message.success(getLabel('message.success'));
      emit('success');
      handleClose();
    } catch (error) {
      if (error?.errorFields?.length) {
        submitLoading.value = false;
        return;
      }
      submitLoading.value = false;
      if (error?.message) {
        message.error(error.message);
      }
    } finally {
      submitLoading.value = false;
    }
  };

  const handleOpen = ({ orderNo = '', withdrawable = 0 } = {}) => {
    resetForm();
    form.orderNo = orderNo || '--';
    availableAmount.value = withdrawable;
    isOpen.value = true;
  };

  defineExpose({
    handleOpen,
  });
</script>

<style scoped lang="less">
  .withdraw-notice {
    margin-top: 10px;
  }
</style>
