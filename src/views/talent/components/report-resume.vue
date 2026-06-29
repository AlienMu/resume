<template>
  <a-modal
    :cancel-button-props="{ ghost: true, type: 'primary' }"
    width="420px"
    :title="modalTitle"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :ok-text="submitText"
    :cancel-text="cancelText"
    :confirm-loading="submitLoading"
    :mask-closable="false"
    destroy-on-close
    @ok="handleSubmit"
    @cancel="handleCancel"
    @afterClose="resetForm"
  >
    <a-flex vertical gap="20">
      <span class="mui-error-text mui-font-size-12">{{ getLabel('reportResume.tips') }} </span>
      <a-form :model="form" ref="formRef" layout="vertical">
        <m-form-item :label="getLabel('reportResume.form.0')" name="reason" required :rules="reasonRules">
          <dictionary-select
            :type="activeContext === 'resume' ? 'report_resume_reason' : 'report_job_reason'"
            v-model:value="form.reason"
            :placeholder="getPlaceholder('reportResume.form.0', true)"
          />
        </m-form-item>
        <m-form-item vertical :label="getLabel('reportResume.form.1')" name="description">
          <a-textarea
            :maxlength="200"
            :rows="3"
            :placeholder="getPlaceholder('reportResume.form.1')"
            :bordered="false"
            v-model:value="form.description"
          />
        </m-form-item>
        <a-flex gap="10" vertical>
          <div class="mui-font-size-20 mui-title-text text-center">{{ getLabel('reportResume.form.2') }}</div>
          <a-form-item name="images" :rules="uploadRules">
            <m-upload-card v-model:files="form.images" :max-upload-size="4" size="small" />
          </a-form-item>
        </a-flex>
      </a-form>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import { Flex } from 'ant-design-vue';
  import { computed, h, onBeforeUnmount, ref } from 'vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import MUploadCard from '/@/components/mui/m-upload-card/m-upload-card.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { reportJob } from '/@/api/job';
  import { reportResume } from '/@/api/resume';
  import { getBasicRules } from '/@/config/rule-config';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { getElementByString, getModal } from '/@/utils/element-util';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';

  const props = defineProps({
    context: {
      type: String,
      default: 'resume',
    },
  });

  const { getLabel, getPlaceholder, getCommon } = useI18nText({ local: 'talent.modal' });

  const isOpen = ref(false);
  const formRef = ref();
  const submitLoading = ref(false);
  const activeContext = ref(props.context);
  const targetId = ref();

  const DEFAULT_REASON_KEYS = ['fakeContact', 'infoMismatch', 'fraud', 'other'];

  const createDefaultForm = () => ({
    reason: undefined,
    description: '',
    images: [],
  });

  const form = ref(createDefaultForm());

  const reasonOptions = computed(() =>
    DEFAULT_REASON_KEYS.map((key) => ({
      label: getLabel(`reportResume.reasonOptions.${key}`),
      value: key,
    }))
  );

  const reasonRules = computed(() => getBasicRules(['required'], getLabel('reportResume.form.0'), 'change'));
  const uploadRules = computed(() => getBasicRules(['required'], getLabel('reportResume.form.2'), 'change'));

  const resolveTitle = (namespace) => {
    const mapPath = `${namespace}.titleMap.${activeContext.value}`;
    const text = getLabel(mapPath);
    if (text !== mapPath) {
      return text;
    }
    return getLabel(`${namespace}.title`);
  };

  const modalTitle = computed(() => resolveTitle('reportResume'));
  const successTitle = computed(() => resolveTitle('reportSuccess'));

  const submitText = computed(() => getLabel('reportResume.submit') || getCommon('modal.ok'));
  const cancelText = computed(() => getLabel('reportResume.cancel') || getCommon('modal.cancel'));

  let successTimer = null;
  let successModalRef = null;

  const clearSuccessModal = () => {
    if (successTimer) {
      clearInterval(successTimer);
      successTimer = null;
    }
    successModalRef?.destroy?.();
    successModalRef = null;
  };

  const showSuccessModal = () => {
    clearSuccessModal();
    let count = 5;
    successModalRef = getModal('success', {
      title: successTitle.value,
      centered: true,
      centerText: true,
      okText: getLabel('reportSuccess.button', { num: count }),
      okButtonProps: {
        ghost: true,
      },
      content: h(Flex, { vertical: true, gap: '20', align: 'center' }, [
        h(SvgIcon, { style: { fontSize: '42px' }, name: 'success-circle' }),
        getElementByString(getLabel('reportSuccess.tips')),
      ]),
      onOk: () => {
        clearSuccessModal();
      },
      onCancel: () => {
        clearSuccessModal();
      },
    });
    successTimer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearSuccessModal();
        return;
      }
      successModalRef?.update?.({
        okText: getLabel('reportSuccess.button', { num: count }),
      });
    }, 1000);
  };

  const extractImageUrls = (files) => (Array.isArray(files) ? files.map((item) => item?.url).filter(Boolean) : []);

  const resolveReasonLabel = (value) => {
    const option = reasonOptions.value.find((item) => item.value === value);
    return option?.label || value;
  };

  const open = ({ targetId: id, context } = {}) => {
    if (!id) {
      console.warn('[report-resume] missing targetId');
      return;
    }
    targetId.value = id;
    activeContext.value = context || props.context || 'resume';
    resetForm();
    isOpen.value = true;
  };

  const handleCancel = () => {
    isOpen.value = false;
  };

  const resetForm = () => {
    form.value = createDefaultForm();
    formRef.value?.clearValidate?.();
  };

  const handleSubmit = async () => {
    if (!targetId.value || submitLoading.value) return;
    try {
      await formRef.value?.validate?.();
    } catch {
      return;
    }
    const context = activeContext.value === 'job' ? 'job' : 'resume';
    const request = context === 'job' ? reportJob : reportResume;
    const bodyKey = context === 'job' ? 'jobId' : 'resumeId';
    const description = form.value.description?.trim();
    const payload = {
      [bodyKey]: targetId.value,
      reason: resolveReasonLabel(form.value.reason),
      images: extractImageUrls(form.value.images),
    };
    if (description) {
      payload.description = description;
    }
    submitLoading.value = true;
    try {
      await request(targetId.value, payload);
      isOpen.value = false;
      showSuccessModal();
    } catch (error) {
      console.error('[report-resume] submit failed', error);
    } finally {
      submitLoading.value = false;
    }
  };

  onBeforeUnmount(() => {
    clearSuccessModal();
  });

  defineExpose({
    open,
  });
</script>

<style scoped lang="less"></style>
