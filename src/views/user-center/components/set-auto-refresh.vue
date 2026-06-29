<template>
  <a-modal
    width="420px"
    :title="getLabel('title')"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :cancel-button-props="{ ghost: true, type: 'primary' }"
    :mask-closable="false"
    destroy-on-close
    @cancel="handleClose"
    @afterClose="resetState"
  >
    <template #footer>
      <a-flex justify="space-between" align="center">
        <a-button block @click="handleClose" :disabled="submitLoading || modalLoading">
          {{ getCommon('modal.cancel') }}
        </a-button>
        <a-button block type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ getLabel('actions.save') }}
        </a-button>
      </a-flex>
    </template>
    <a-spin :spinning="modalLoading">
      <a-flex vertical gap="16">
        <a-alert v-if="errorText" type="error" :message="errorText" show-icon />
        <a-flex align="center" gap="12" justify="space-between">
          <span class="mui-field-label">{{ getLabel('label') }}</span>
          <a-form class="mui-field-form">
            <a-form-item :validate-status="formError ? 'error' : undefined" :help="formError || undefined" class="mui-field-item">
              <a-select
                class="mui-day-select"
                :options="dayOptions"
                :placeholder="getLabel('placeholder')"
                :value="form.refreshDays"
                :disabled="submitLoading"
                allow-clear
                @change="handleChangeDays"
              />
            </a-form-item>
          </a-form>
        </a-flex>

        <span class="tips">{{ getLabel('tips') }}</span>
      </a-flex>
    </a-spin>
  </a-modal>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { cancelResumeAutoRefresh, getResumeAutoRefresh, setResumeAutoRefresh } from '/@/api/resume';
  import { useI18nText } from '/@/hooks/use-i18n-text';

  const LOCAL_SCOPE = 'userCenter.content.resume.autoRefresh';
  const DAY_PRESETS = [1, 3, 7, 15];
  const MIN_DAYS = 1;
  const MAX_DAYS = 365;
  const DEFAULT_DAY = DAY_PRESETS[0] ?? MIN_DAYS;

  const { getLabel, getCommon } = useI18nText({ local: LOCAL_SCOPE });

  const isOpen = ref(false);
  const modalLoading = ref(false);
  const submitLoading = ref(false);
  const cancelLoading = ref(false);
  const targetResumeId = ref();
  const errorText = ref('');
  const formError = ref('');

  const detail = ref(null);

  const createDefaultForm = () => ({
    refreshDays: DEFAULT_DAY,
  });

  const form = ref(createDefaultForm());

  const resolveLocaleText = (name, params) => {
    const text = getLabel(name, params);
    return text === `${LOCAL_SCOPE}.${name}` ? '' : text;
  };

  const dayOptions = computed(() =>
    DAY_PRESETS.map((value, index) => {
      const preset = resolveLocaleText(`optionPreset.${index}`, { num: value });
      const fallback = resolveLocaleText('optionFallback', { num: value }) || `${value}`;
      return {
        value,
        label: preset || fallback,
      };
    })
  );

  const hasActiveSetting = computed(() => detail.value?.autoRefreshEnabled === 1);

  const statusText = computed(() => getLabel(`status.${hasActiveSetting.value ? 'enabled' : 'disabled'}`));

  const statusDesc = computed(() =>
    hasActiveSetting.value ? getLabel('status.enabledDesc', { num: detail.value?.remainingDays ?? 0 }) : getLabel('status.disabledDesc')
  );

  const statisticsRows = computed(() => {
    if (!hasActiveSetting.value) return [];
    const data = detail.value || {};
    return [
      { key: 'start', label: getLabel('statistics.start'), value: data.autoRefreshStartDate },
      { key: 'end', label: getLabel('statistics.end'), value: data.autoRefreshEndDate },
      { key: 'last', label: getLabel('statistics.last'), value: data.lastAutoRefreshAt },
      { key: 'remaining', label: getLabel('statistics.remaining'), value: data.remainingDays },
    ];
  });

  const placeholderText = computed(() => getLabel('statistics.placeholder'));

  const resolveStatisticValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return placeholderText.value;
    }
    return value;
  };

  const resetErrors = () => {
    errorText.value = '';
    formError.value = '';
  };

  const handleChangeDays = (value) => {
    form.value.refreshDays = typeof value === 'number' ? value : undefined;
    if (formError.value) {
      formError.value = '';
    }
  };

  const validateForm = () => {
    const days = Number(form.value.refreshDays);
    if (!days) {
      formError.value = getLabel('validation.required');
      return false;
    }
    if (days < MIN_DAYS || days > MAX_DAYS) {
      formError.value = getLabel('validation.range', { min: MIN_DAYS, max: MAX_DAYS });
      return false;
    }
    formError.value = '';
    return true;
  };

  const fetchSettings = async () => {
    if (!targetResumeId.value) return;
    try {
      modalLoading.value = true;
      const data = await getResumeAutoRefresh(targetResumeId.value);
      detail.value = data || null;
      if (typeof data?.autoRefreshDays === 'number') {
        form.value.refreshDays = data.autoRefreshDays;
      }
      resetErrors();
    }  finally {
      modalLoading.value = false;
    }
  };

  const handleSubmit = async () => {
    if (!targetResumeId.value || submitLoading.value) return;
    if (!validateForm()) return;
    try {
      submitLoading.value = true;
      const data = await setResumeAutoRefresh(targetResumeId.value, {
        refreshDays: form.value.refreshDays,
      });
      detail.value = data || detail.value;
      resetErrors();
      handleClose();
    } finally {
      submitLoading.value = false;
    }
  };

  const handleCancelAutoRefresh = async () => {
    if (!targetResumeId.value || cancelLoading.value) return;
    try {
      cancelLoading.value = true;
      await cancelResumeAutoRefresh(targetResumeId.value);
      await fetchSettings();
    }  finally {
      cancelLoading.value = false;
    }
  };

  const handleOpen = (record) => {
    const resumeId = typeof record === 'number' ? record : record?.id;
    if (!resumeId) return;
    targetResumeId.value = resumeId;
    form.value = createDefaultForm();
    resetErrors();
    isOpen.value = true;
    fetchSettings();
  };

  const handleClose = () => {
    isOpen.value = false;
  };

  const resetState = () => {
    form.value = createDefaultForm();
    detail.value = null;
    targetResumeId.value = undefined;
    errorText.value = '';
    formError.value = '';
    modalLoading.value = false;
    submitLoading.value = false;
    cancelLoading.value = false;
  };

  defineExpose({
    handleOpen,
  });
</script>

<style scoped lang="less">
  .mui-field-label {
    font-size: 14px;
    color: @font-primary-color;
  }

  .mui-field-form {
    flex: 1;
    margin: 0;
  }

  .mui-field-item {
    margin-bottom: 0;
  }

  .mui-day-select {
    width: 140px;
  }

  .auto-refresh-panel {
    padding: 12px 16px;
    border-radius: 12px;
    background: #fafafa;
    border: 1px solid @border-color;
  }

  .panel-header {
    margin-bottom: 4px;
  }

  .panel-title {
    font-weight: 500;
    color: @font-primary-color;
  }

  .panel-desc {
    font-size: 12px;
    color: @font-tip-color;
  }

  .panel-divider {
    margin: 12px 0;
  }

  .tips {
    font-size: 12px;
    color: @font-tip-color;
  }
</style>
