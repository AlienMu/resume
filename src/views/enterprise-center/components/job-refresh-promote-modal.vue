<template>
  <a-modal
    v-model:open="isOpen"
    :title="getModalLabel('title')"
    :width="480"
    wrap-class-name="mui-modal"
    
    :mask-closable="false"
    destroy-on-close
    :ok-button-props="{ loading: modalLoading }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-flex vertical gap="16">
      <div class="modal-tip">{{ getModalLabel('tip') }}</div>

      <m-form-item :label="getModalLabel('label')" required>
        <m-select v-model:value="selectedDays" :placeholder="getModalLabel('placeholder')" :options="dayOptions" />
      </m-form-item>

      <div class="price-card">
        <div class="price-card__title">{{ getModalLabel('priceTitle') }}</div>
        <div class="price-row">
          <span class="price-row__label">{{ getModalLabel('originalPrice') }}</span>
          <span class="price-row__value">{{ originalUnitPriceText }}</span>
        </div>
        <div class="price-row">
          <span class="price-row__label">{{ getModalLabel('discountPrice') }}</span>
          <span class="price-row__value price-discount">{{ discountUnitPriceText }}</span>
        </div>
        <div class="price-row price-row--total">
          <span class="price-row__label">{{ getModalLabel('totalCost') }}</span>
          <span class="price-row__value price-total">{{ totalCostText }}</span>
        </div>

        <div class="price-row">
          <span class="price-row__label">{{ getModalLabel('balance') }}</span>
          <span class="price-row__value">{{ balanceText }}</span>
        </div>

        <div v-if="modalType === 'promote'" class="price-row">
          <span class="price-row__label">{{ getModalLabel('remainingPromotionSlots') }}</span>
          <span class="price-row__value" :class="{ 'text-danger': isSlotsInsufficient }">{{ remainingPromotionSlotsValue }}</span>
        </div>

        <div v-if="isOverBalance" class="hint-danger">{{ getModalLabel('balanceWarning') }}</div>
        <div v-if="isSlotsInsufficient" class="hint-danger">{{ getModalLabel('slotsWarning') }}</div>
        <div class="hint-muted">{{ getModalLabel('balanceHint') }}</div>
      </div>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { refreshJobWithPayment, promoteJob } from '/@/api/job';

  const { getLabel } = useI18nText({ local: 'enterpriseCenter.jobRecords' });

  const isOpen = ref(false);
  const modalLoading = ref(false);
  const modalType = ref(null); // 'refresh' or 'promote'
  const currentRecord = ref(null);
  const selectedDays = ref(null);
  const dayOptions = computed(() => [
    { label: getLabel('modal.common.dayOptions.1'), value: 1 },
    { label: getLabel('modal.common.dayOptions.3'), value: 3 },
    { label: getLabel('modal.common.dayOptions.7'), value: 7 },
    { label: getLabel('modal.common.dayOptions.15'), value: 15 },
    { label: getLabel('modal.common.dayOptions.30'), value: 30 },
  ]);

  const emit = defineEmits(['confirm']);

  const getModalLabel = (key) => {
    if (!modalType.value) return '';
    return getLabel(`modal.${modalType.value}.${key}`);
  };

  const toNumber = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoney = (val) => toNumber(val).toFixed(2);

  const balanceValue = computed(() => toNumber(currentRecord.value?.balance));
  const remainingPromotionSlotsValue = computed(() => Number(currentRecord.value?.remainingPromotionSlots ?? 0));

  const originalUnitPrice = computed(() => {
    if (modalType.value === 'refresh') return toNumber(currentRecord.value?.refreshJobOriginalPrice);
    if (modalType.value === 'promote') return toNumber(currentRecord.value?.promoteJobOriginalPrice);
    return 0;
  });

  const discountUnitPrice = computed(() => {
    if (modalType.value === 'refresh') return toNumber(currentRecord.value?.refreshJobDiscountPrice);
    if (modalType.value === 'promote') return toNumber(currentRecord.value?.promoteJobDiscountPrice);
    return 0;
  });

  const totalCostValue = computed(() => discountUnitPrice.value * toNumber(selectedDays.value));
  const isOverBalance = computed(() => toNumber(selectedDays.value) > 0 && totalCostValue.value > balanceValue.value);
  const isSlotsInsufficient = computed(() => modalType.value === 'promote' && remainingPromotionSlotsValue.value <= 0);

  const originalUnitPriceText = computed(() => getLabel('modal.common.unitPerDay', { price: formatMoney(originalUnitPrice.value) }));
  const discountUnitPriceText = computed(() => getLabel('modal.common.unitPerDay', { price: formatMoney(discountUnitPrice.value) }));
  const totalCostText = computed(() => getLabel('modal.common.amount', { amount: formatMoney(totalCostValue.value) }));
  const balanceText = computed(() => getLabel('modal.common.amount', { amount: formatMoney(balanceValue.value) }));

  const handleOk = async () => {
    if (!selectedDays.value) {
      message.warning(getLabel('modal.common.selectDaysWarning'));
      return;
    }
    if (!currentRecord.value) {
      return;
    }

    const record = currentRecord.value;

    try {
      modalLoading.value = true;

      const data = { days: selectedDays.value };
      if (modalType.value === 'refresh') {
        await refreshJobWithPayment(record.id, data);
        message.success(getLabel('message.refreshSuccess'));
      } else if (modalType.value === 'promote') {
        await promoteJob(record.id, data);
        message.success(getLabel('message.promoteSuccess'));
      }

      isOpen.value = false;
      emit('confirm');
    } finally {
      modalLoading.value = false;
    }
  };

  const handleCancel = () => {
    isOpen.value = false;
  };

  const open = (options = {}) => {
    modalType.value = options.type; // 'refresh' or 'promote'
    currentRecord.value = options.record;
    selectedDays.value = 1;
    isOpen.value = true;
  };

  defineExpose({
    open,
  });
</script>

<style scoped lang="less">
  .modal-tip {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 1.5;
    padding: 4px 0 0;
  }

  .price-card {
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: rgba(0, 0, 0, 0.02);
    padding: 12px;
  }

  .price-card__title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    margin-bottom: 10px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
    padding: 4px 0;
  }

  .price-row--total {
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px dashed rgba(0, 0, 0, 0.12);
  }

  .price-row__label {
    color: rgba(0, 0, 0, 0.6);
  }

  .price-row__value {
    color: rgba(0, 0, 0, 0.85);
  }

  .price-discount {
    color: #ff4d4f;
    font-weight: 700;
  }

  .price-total {
    color: #ff4d4f;
    font-weight: 700;
  }

  .hint-muted {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 1.4;
  }

  .hint-danger {
    margin-top: 8px;
    font-size: 12px;
    color: #ff4d4f;
    line-height: 1.4;
    font-weight: 600;
  }

  .text-danger {
    color: #ff4d4f;
    font-weight: 600;
  }
</style>
