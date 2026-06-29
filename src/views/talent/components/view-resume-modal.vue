<template>
  <a-modal
    :cancel-button-props="{ ghost: true, type: 'primary' }"
    width="420px"
    :title="getLabel('viewResume.title')"
    v-model:open="isOpen"
    :header-style="{ textAlign: 'center' }"
    wrap-class-name="mui-modal"
    :mask-closable="false"
    destroy-on-close
    :footer="false"
  >
    <a-flex vertical gap="20">
      <div v-if="isHighValue" class="view-resume-content">
        <p class="mui-font-size-16 mui-title-text">{{ getLabel('viewResume.highValueLabel') }}</p>
        <div class="mui-desc-text" v-html="highValueContent"></div>
      </div>
      <div v-else class="view-resume-content">
        <div class="mui-desc-text" v-html="normalContent"></div>
      </div>
      <a-flex gap="10" justify="center">
        <a-button type="primary" ghost style="width: 130px; padding: 0" @click="handleCancel">{{ getLabel('viewResume.cancelButton') }}</a-button>
        <a-button :loading="submitLoading" type="primary" style="width: 130px; padding: 0" @click="handleOk">
          {{ getLabel('viewResume.okButton') }}
        </a-button>
      </a-flex>
      <div class="view-resume-tips" v-html="getLabel('viewResume.tips')"></div>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { message } from 'ant-design-vue';
  import { payToViewResume } from '/@/api/resume';

  const { getLabel } = useI18nText({ local: 'talent.modal' });

  const isOpen = ref(false);
  const submitLoading = ref(false);
  const resumeId = ref(null);
  const isHighValue = ref(false);
  const price = ref(0);
  const originalPrice = ref(0);

  const emit = defineEmits(['ok', 'cancel', 'success']);

  const normalContent = computed(() => {
    return getLabel('viewResume.content.0', { num: price.value, originalPrice: originalPrice.value });
  });

  const highValueContent = computed(() => {
    return getLabel('viewResume.content.1', { num: price.value, originalPrice: originalPrice.value });
  });

  const handleOk = async () => {
    if (!resumeId.value || submitLoading.value) return;
    submitLoading.value = true;
    try {
      const detail = await payToViewResume(resumeId.value);
      message.success(getLabel('viewResume.success'));
      emit('success', { resumeId: resumeId.value, detail });
      isOpen.value = false;
    } finally {
      submitLoading.value = false;
    }
  };

  const handleCancel = () => {
    emit('cancel');
    isOpen.value = false;
  };

  const open = (options = {}) => {
    if (!options.resumeId) {
      console.warn('[view-resume-modal] missing resumeId');
      return;
    }
    resumeId.value = options.resumeId;
    isHighValue.value = Boolean(options.isHighValue);
    price.value = options.discountPrice ?? options.price ?? 0;
    originalPrice.value = options.originalPrice ?? 0;
    isOpen.value = true;
  };

  defineExpose({
    open,
  });
</script>

<style scoped lang="less">
  .view-resume-content {
    text-align: center;
  }

  .view-resume-tips {
    text-align: center;
  }
</style>
