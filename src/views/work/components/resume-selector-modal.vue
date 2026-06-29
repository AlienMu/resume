<template>
  <a-modal
    v-model:open="isOpen"
    :title="getLabel('resumeModal.title')"
    :ok-text="getLabel('resumeModal.okText')"
    :cancel-text="getLabel('resumeModal.cancelText')"
    :width="560"
    :mask-closable="false"
    destroy-on-close
    :confirmLoading="loading"
    :ok-button-props="{ disabled: !selectedResumeId }"
    @ok="handleOk"
    @cancel="handleCancel"
    wrap-class-name="mui-modal"
  >
    <a-flex vertical gap="12" class="resume-selector__container">
      <p class="resume-selector__instruction">{{ getLabel('resumeModal.instruction') }}</p>
      <div v-if="!resumeOptions.length" class="resume-selector__empty">
        {{ getLabel('resumeModal.empty') }}
      </div>
      <div v-else class="resume-selector__list">
        <a-radio-group v-model:value="selectedResumeId" class="resume-selector__radio-group">
          <a-flex vertical gap="16">
            <a-radio v-for="option in resumeOptions" :key="option.id" :value="option.id" class="resume-selector__item">
              <div class="resume-selector__meta">
                <strong class="resume-selector__title">{{ option.title }}</strong>
                <span v-if="option.desc" class="resume-selector__desc">{{ option.desc }}</span>
                <span v-if="option.updatedAt" class="resume-selector__updated">
                  {{ getLabel('resumeModal.updatedAt', { time: option.updatedAt }) }}
                </span>
              </div>
            </a-radio>
          </a-flex>
        </a-radio-group>
      </div>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import { ref } from 'vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { applyJob } from '/@/api/application';
  import { message } from 'ant-design-vue';

  const { getLabel, getCommon } = useI18nText({ local: 'workMore.detail' });

  const isOpen = ref(false);
  const resumeOptions = ref([]);
  const selectedResumeId = ref(null);
  const loading = ref(false);
  let currentJobId = null;
  let currentOnAppliedCallback = null;

  const emit = defineEmits(['applied', 'cancel']);

  const handleOk = async () => {
    if (!selectedResumeId.value || !currentJobId) {
      message.warning(getLabel('resumeModal.validation'));
      return;
    }
    loading.value = true;
    try {
      await applyJob({
        jobId: Number(currentJobId),
        resumeId: selectedResumeId.value,
      });
      message.success(getCommon('messages.success.submit'));
      emit('applied', selectedResumeId.value);

      // 如果有投递成功后的回调，执行它
      if (currentOnAppliedCallback && typeof currentOnAppliedCallback === 'function') {
        currentOnAppliedCallback(selectedResumeId.value);
      }

      isOpen.value = false;
    } finally {
      loading.value = false;
    }
  };

  const handleCancel = () => {
    emit('cancel');
    isOpen.value = false;
  };

  const open = (options = {}) => {
    resumeOptions.value = Array.isArray(options.resumeOptions) ? options.resumeOptions : [];
    selectedResumeId.value = options.initialSelectedId ?? (resumeOptions.value[0] && resumeOptions.value[0].id) ?? null;
    currentJobId = options.jobId ?? null;
    loading.value = false;
    isOpen.value = true;
    // 存储投递成功后的回调
    currentOnAppliedCallback = options.onApplied;
  };

  const setLoading = (val = false) => {
    loading.value = !!val;
  };

  const close = () => {
    isOpen.value = false;
  };

  defineExpose({
    open,
    setLoading,
    close,
  });
</script>

<style scoped lang="less">
  .resume-selector__instruction {
    margin: 0;
    color: rgba(103, 110, 132, 1);
  }
  .resume-selector__empty {
    padding: 8px 0;
    color: rgba(103, 110, 132, 1);
  }
  .resume-selector__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .resume-selector__item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid rgba(237, 237, 237, 1);
    border-radius: 8px;
    cursor: pointer;
  }
  .resume-selector__radio {
    margin-top: 4px;
  }
  .resume-selector__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .resume-selector__title {
    color: rgba(15, 21, 37, 1);
    font-size: 14px;
  }
  .resume-selector__desc {
    color: rgba(92, 115, 148, 1);
    font-size: 12px;
  }
  .resume-selector__updated {
    color: rgba(141, 143, 153, 1);
    font-size: 12px;
  }
</style>
