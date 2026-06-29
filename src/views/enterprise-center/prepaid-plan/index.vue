<template>
  <content-head />
  <a-flex vertical gap="30" class="prepaid-plan">
    <a-spin :spinning="priceLoading || calculateLoading">
      <div class="mui-table">
        <table style="width: 100%">
          <thead>
            <tr class="table-title">
              <td colspan="7">
                {{ getLabel('customRecruitmentPackage') }}
              </td>
            </tr>
            <tr>
              <td>{{ getLabel('item') }}</td>
              <td>{{ getLabel('unitPrice') }}</td>
              <td>{{ getLabel('quantity') }}</td>
              <td>{{ getLabel('totalPrice') }}</td>
              <td>{{ getLabel('discount') }}</td>
              <td>{{ getLabel('discountedUnitPrice') }}</td>
              <td>{{ getLabel('validityPeriod') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ getLabel('positionRelease') }}</td>
              <td>{{ getUnitPrice('jobPost') }}</td>
              <td>
                <a-flex align="center" justify="center">
                  <span class="minus" @click="handleDecrease('jobPostCount')">-</span>
                  <a-input-number
                    :min="getMinQuantity('jobPostCount')"
                    :value="quantities.jobPostCount"
                    :precision="0"
                    style="width: 60px"
                    size="small"
                    :bordered="false"
                    :controls="false"
                    @change="(val) => handleQuantityChange('jobPostCount', val)"
                  />
                  <span class="plus" @click="handleIncrease('jobPostCount')">+</span>
                </a-flex>
              </td>
              <td>{{ getOriginalPrice('jobPostCount') }}</td>
              <td class="mui-error-text">{{ formatDiscount(getDiscountRate('jobPostCount')) }}</td>
              <td class="mui-error-text">{{ getDiscountedUnitPrice('jobPostCount') }}</td>
              <td rowspan="4" class="mui-desc-text">
                <div style="width: 8em; margin: 0 auto">
                  {{ getLabel('validityNotice', { days: priceData.validityDays }) }}
                </div>
              </td>
            </tr>
            <tr>
              <td>{{ getLabel('viewContact') }}</td>
              <td>{{ getUnitPrice('resumeContact') }}</td>
              <td>
                <a-flex align="center" justify="center">
                  <span class="minus" @click="handleDecrease('resumeContactCount')">-</span>
                  <a-input-number
                    :min="getMinQuantity('resumeContactCount')"
                    :value="quantities.resumeContactCount"
                    :precision="0"
                    style="width: 60px"
                    size="small"
                    :bordered="false"
                    :controls="false"
                    @change="(val) => handleQuantityChange('resumeContactCount', val)"
                  />
                  <span class="plus" @click="handleIncrease('resumeContactCount')">+</span>
                </a-flex>
              </td>
              <td>{{ getOriginalPrice('resumeContactCount') }}</td>
              <td class="mui-error-text">{{ formatDiscount(getDiscountRate('resumeContactCount')) }}</td>
              <td class="mui-error-text">{{ getDiscountedUnitPrice('resumeContactCount') }}</td>
              <td></td>
            </tr>
            <tr>
              <td>{{ getLabel('positionTop') }}</td>
              <td>{{ getUnitPrice('jobPromotion') }}</td>
              <td>
                <a-flex align="center" justify="center">
                  <span class="minus" @click="handleDecrease('jobPromotionCount')">-</span>
                  <a-input-number
                    :min="getMinQuantity('jobPromotionCount')"
                    :value="quantities.jobPromotionCount"
                    :precision="0"
                    style="width: 60px"
                    size="small"
                    :bordered="false"
                    :controls="false"
                    @change="(val) => handleQuantityChange('jobPromotionCount', val)"
                  />
                  <span class="plus" @click="handleIncrease('jobPromotionCount')">+</span>
                </a-flex>
              </td>
              <td>{{ getOriginalPrice('jobPromotionCount') }}</td>
              <td class="mui-error-text">{{ formatDiscount(getDiscountRate('jobPromotionCount')) }}</td>
              <td class="mui-error-text">{{ getDiscountedUnitPrice('jobPromotionCount') }}</td>
              <td></td>
            </tr>
            <tr>
              <td>{{ getLabel('positionRefresh') }}</td>
              <td>{{ getUnitPrice('jobRefresh') }}</td>
              <td>
                <a-flex align="center" justify="center">
                  <span class="minus" @click="handleDecrease('jobRefreshCount')">-</span>
                  <a-input-number
                    :min="getMinQuantity('jobRefreshCount')"
                    :value="quantities.jobRefreshCount"
                    :precision="0"
                    style="width: 60px"
                    size="small"
                    :bordered="false"
                    :controls="false"
                    @change="(val) => handleQuantityChange('jobRefreshCount', val)"
                  />
                  <span class="plus" @click="handleIncrease('jobRefreshCount')">+</span>
                </a-flex>
              </td>
              <td>{{ getOriginalPrice('jobRefreshCount') }}</td>
              <td class="mui-error-text">{{ formatDiscount(getDiscountRate('jobRefreshCount')) }}</td>
              <td class="mui-error-text">{{ getDiscountedUnitPrice('jobRefreshCount') }}</td>
              <td></td>
            </tr>
            <tr>
              <td>{{ getLabel('total') }}</td>
              <td colspan="2"></td>
              <td>{{ calculatedPrice.originalTotalPrice || 0 }}</td>
              <td colspan="3"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-spin>
    <a-flex gap="10" align="center">
      <span class="mui-font-size-16 mui-desc-text">{{ getLabel('finalOrderInfo') }}</span>
      <span class="mui-font-size-12 mui-error-text">{{ getLabel('transferFee') }}</span>
    </a-flex>
    <a-form class="prepaid-plan-form" ref="formRef" :model="form" :rules="formRules">
      <m-form-item :label="getLabel('orderNumber')" name="preOrderNo">
        <a-input :maxlength="100" :placeholder="getPlaceholder('orderNumber')" v-model:value.trim="form.preOrderNo" :disabled="true" />
      </m-form-item>
      <m-form-item :label="getLabel('rechargeAmount')" name="rechargeAmount">
        <a-input :maxlength="25" :placeholder="getPlaceholder('rechargeAmount')" v-model:value.trim="form.rechargeAmount" :disabled="true" />
      </m-form-item>
      <a-flex gap="10" style="width: 100%">
        <div style="flex: 1">
          <m-form-item :label="getLabel('verificationCode')" name="captcha">
            <a-input :maxlength="10" :placeholder="getPlaceholder('verificationCode')" v-model:value.trim="form.captcha" />
          </m-form-item>
        </div>
        <div class="captcha-box" role="button" tabindex="0" @click="handleRefreshCaptcha">
          <a-image :preview="false" class="mui-message-code" :src="captcha.image" />
        </div>
      </a-flex>
      <a-flex justify="center" style="margin-top: 10px">
        <a-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ getLabel('submitOrderAndPay') }}</a-button>
      </a-flex>
    </a-form>
  </a-flex>
  <a-flex vertical gap="30" style="padding-bottom: 20px">
    <a-flex vertical gap="24" class="mui-tips">
      <a-flex align="center" gap="5">
        <span class="mui-primary-text"><svg-icon name="tips" /></span>
        <div class="mui-tips-title">{{ getLabel('rechargeAssistant') }}</div>
      </a-flex>
      <a-flex gap="8" vertical>
        <div class="mui-tips-desc">{{ getLabel('tips.0') }}</div>
        <div class="mui-tips-desc">{{ getLabel('tips.1') }}</div>
        <div class="mui-tips-desc">{{ getLabel('tips.2') }}</div>
        <div class="mui-tips-desc">{{ getLabel('tips.3') }}</div>
      </a-flex>
    </a-flex>
  </a-flex>
  <RechargeConfirmModal ref="rechargeConfirmModalRef" @success="handleRechargeSuccess" />
</template>

<script setup>
  import ContentHead from '../components/content-head.vue';
  import { onMounted, ref, reactive, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { getStoragePrices, calculateStoragePrice, generateStorageCaptcha, createStorageOrder } from '/@/api/company';
  import RechargeConfirmModal from './components/recharge-confirm-modal.vue';
  import { useUserStore } from '/@/store/modules/system/user';

  const userStore = useUserStore();
  const rechargeConfirmModalRef = ref();

  const { getLabel, getPlaceholder } = useI18nText({ local: 'enterpriseCenter.prepaidPlan' });

  const PRICE_ITEM_KEY_MAP = {
    jobPostCount: 'jobPost',
    resumeContactCount: 'resumeContact',
    jobPromotionCount: 'jobPromotion',
    jobRefreshCount: 'jobRefresh',
  };

  const createEmptyPriceItem = () => ({
    id: undefined,
    itemName: '',
    unit: '',
    minQuantity: 1,
    originalPrice: 0,
    discountRate: null,
    discountedPrice: 0,
    remark: '',
  });

  // Price data
  const priceData = ref({
    jobPost: createEmptyPriceItem(),
    resumeContact: createEmptyPriceItem(),
    jobPromotion: createEmptyPriceItem(),
    jobRefresh: createEmptyPriceItem(),
    validityDays: 90,
  });

  // Quantities
  const quantities = reactive({
    jobPostCount: 1,
    resumeContactCount: 1,
    jobPromotionCount: 1,
    jobRefreshCount: 1,
  });

  // Calculated price
  const calculatedPrice = ref({
    originalTotalPrice: 0,
    discountedPrice: 0,
  });

  // Price details (returned from the API)
  const priceDetails = ref([]);

  // Form
  const form = reactive({
    preOrderNo: '',
    rechargeAmount: '',
    captcha: '',
  });

  const formRef = ref();

  // Form validation rules
  const formRules = computed(() => ({
    captcha: [{ required: true, message: getLabel('verificationCodeRequired'), trigger: 'blur' }],
  }));

  // Captcha
  const captcha = reactive({
    key: '',
    image: '',
  });

  // Loading state
  const priceLoading = ref(false);
  const calculateLoading = ref(false);
  const submitLoading = ref(false);

  // Format discount
  const formatDiscount = (discountRate) => {
    if (discountRate === null || discountRate === undefined) return '';
    const rate = Number(discountRate);
    if (rate === 0) return 'Free';
    if (rate === 10) return 'No discount';
    return `${(10 - rate) * 10}% off`;
  };

  // Format validity period
  const formatValidityPeriod = (days) => {
    if (!days) return '';
    if (days === -1 || days === 0) return getLabel('validityForever');
    return `${days}${getLabel('days')}`;
  };

  // Get price detail by type (matched directly via the type field)
  const getPriceDetailByType = (type) => {
    return priceDetails.value.find((item) => item.type === type) || null;
  };

  // Get original price (from API data, returned directly without formatting)
  const getOriginalPrice = (type) => {
    const detail = getPriceDetailByType(type);
    return detail ? detail.originalTotalPrice : 0;
  };

  // Get discounted unit price (uses the discountedUnitPrice field returned by the API directly)
  const getDiscountedUnitPrice = (type) => {
    const detail = getPriceDetailByType(type);
    return detail ? detail.discountedUnitPrice || 0 : 0;
  };

  // Get discount rate (from API data)
  const getDiscountRate = (type) => {
    const detail = getPriceDetailByType(type);
    return detail ? detail.discountRate : null;
  };

  const getPriceItemByQuantity = (quantityKey) => {
    const priceKey = PRICE_ITEM_KEY_MAP[quantityKey];
    return priceKey ? priceData.value[priceKey] || createEmptyPriceItem() : createEmptyPriceItem();
  };

  const getMinQuantity = (quantityKey) => {
    return getPriceItemByQuantity(quantityKey).minQuantity || 1;
  };

  const getUnitPrice = (priceKey) => {
    // Return the raw value directly, without formatting
    return priceData.value[priceKey]?.originalPrice || 0;
  };

  const syncQuantitiesWithMin = () => {
    Object.keys(PRICE_ITEM_KEY_MAP).forEach((quantityKey) => {
      const min = getMinQuantity(quantityKey);
      if (!quantities[quantityKey] || quantities[quantityKey] < min) {
        quantities[quantityKey] = min;
      }
    });
  };

  const formatAmount = (value) => Number(value || 0).toFixed(2);

  // Increase / decrease quantity
  const handleDecrease = (type) => {
    const min = getMinQuantity(type);
    if (quantities[type] > min) {
      quantities[type]--;
      handleCalculatePrice();
    }
  };

  const handleIncrease = (type) => {
    quantities[type]++;
    handleCalculatePrice();
  };

  const handleQuantityChange = (type, val) => {
    const min = getMinQuantity(type);
    if (val && val >= min) {
      quantities[type] = val;
    } else {
      quantities[type] = min;
    }
    handleCalculatePrice();
  };

  // Get unit prices
  const getPrices = async () => {
    try {
      priceLoading.value = true;
      const data = await getStoragePrices();
      if (data) {
        priceData.value = {
          jobPost: { ...createEmptyPriceItem(), ...(data.jobPost || {}) },
          resumeContact: { ...createEmptyPriceItem(), ...(data.resumeContact || {}) },
          jobPromotion: { ...createEmptyPriceItem(), ...(data.jobPromotion || {}) },
          jobRefresh: { ...createEmptyPriceItem(), ...(data.jobRefresh || {}) },
          validityDays: data.validityDays || 90,
        };
        syncQuantitiesWithMin();
        handleCalculatePrice();
      }
    } finally {
      priceLoading.value = false;
    }
  };

  // Calculate price
  const handleCalculatePrice = async () => {
    try {
      calculateLoading.value = true;
      const data = await calculateStoragePrice({
        jobPostCount: quantities.jobPostCount,
        resumeContactCount: quantities.resumeContactCount,
        jobPromotionCount: quantities.jobPromotionCount,
        jobRefreshCount: quantities.jobRefreshCount,
      });
      if (data) {
        // Store price details
        priceDetails.value = data.priceDetails || [];
        // Store total price (use the raw value directly, without formatting)
        calculatedPrice.value = {
          originalTotalPrice: data.totalOriginalPrice || 0,
          discountedPrice: data.totalDiscountedPrice || 0,
        };
        form.preOrderNo = data.preOrderNo || '';
        form.rechargeAmount = data.totalOriginalPrice || 0;
      }
    } finally {
      calculateLoading.value = false;
    }
  };

  // Refresh captcha
  const handleRefreshCaptcha = async () => {
    const data = await generateStorageCaptcha();
    if (data) {
      captcha.key = data.captchaKey || data.captchaId || data.key || data.id || '';
      captcha.image = data.captchaImage;
    }
  };

  // Submit order
  const handleSubmit = async () => {
    try {
      await formRef.value.validate();
      if (!captcha.key) {
        message.error(getLabel('captchaLoadFailed'));
        await handleRefreshCaptcha();
        return;
      }
      if (!form.preOrderNo) {
        message.error(getLabel('calculatePriceFailed'));
        await handleCalculatePrice();
        handleRefreshCaptcha();
        return;
      }
      submitLoading.value = true;
      const res = await createStorageOrder({
        jobPostCount: quantities.jobPostCount,
        resumeContactCount: quantities.resumeContactCount,
        jobPromotionCount: quantities.jobPromotionCount,
        jobRefreshCount: quantities.jobRefreshCount,
        totalPrice: Number(calculatedPrice.value.originalTotalPrice || 0),
        captcha: form.captcha,
        captchaKey: captcha.key,
        preOrderNo: form.preOrderNo,
      });
      const orderNo = res.orderNo || '';
      // Open the recharge confirmation modal
      rechargeConfirmModalRef.value?.handleOpen({
        orderNo,
        amount: form.rechargeAmount,
      });
      handleCalculatePrice();
      handleRefreshCaptcha();
    } finally {
      submitLoading.value = false;
    }
  };

  const handleRechargeSuccess = async () => {
    await getPrices();
    await handleRefreshCaptcha();
  };

  onMounted(async () => {
    await getPrices();
    await handleRefreshCaptcha();
  });
</script>

<style scoped lang="less">
  .prepaid-plan {
    border-top: 1px solid @border-color;
    padding: 20px 36px;

    .prepaid-plan-form {
      margin: -40px auto 0 auto;
      width: 400px;
    }
  }

  .mui-table {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(228, 235, 240, 1);
    .table-title {
      height: 54px;
      color: @font-primary-color;
      background: rgba(247, 247, 247, 1);
      text-align: center;
    }
    .minus,
    .plus {
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: @font-desc-color;
      border: 1px solid @border-color;
      cursor: pointer;
      user-select: none;
      &:hover {
        color: @primary-color;
        border-color: @primary-color;
      }
    }
    :deep(.ant-input-number-input) {
      text-align: center;
    }
    thead {
      tr:not(.table-title) {
        border-bottom: 1px solid @border-color;
        td {
          text-align: center;
          height: 50px;
          width: calc(100% / 7);
        }
        td:not(:last-child) {
          border-right: 1px solid @border-color;
        }
      }
    }
    tbody {
      tr {
        &:not(:last-child) {
          border-bottom: 1px solid @border-color;
        }
        td {
          text-align: center;
          height: 50px;
          width: calc(100% / 7);
        }
        td:not(:last-child) {
          border-right: 1px solid @border-color;
        }
      }
    }
  }

  .captcha-box {
    cursor: pointer;
    position: relative;

    .captcha-placeholder {
      font-size: 12px;
      color: @font-desc-color;
    }
  }
</style>
<route>
{
auth: 'prepaidPlan',
parentId: 'enterprise-center',
sort: 4
}
</route>
