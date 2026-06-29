<template>
  <div class="job-edit">
    <a-flex class="job-edit-head" justify="space-between" align="center">
      <a-flex align="center" gap="5">
        <div class="title">{{ getLabel('title', 1) }}</div>
        <div class="label">
          {{ $t('enterpriseCenter.jobEdit.tips', { freeJobPostingCount: userStore.siteConfig.otherItems.freeJobPostingCount }) }}
        </div>
      </a-flex>
      <a-flex gap="13">
        <a-flex align="center" gap="8">
          <a-spin :indicator="indicator" v-if="showAutoSaveSpinner" />
          <span class="auto-loading">{{ getCommon('autoLoading', autoSaveMessageIndex) }}</span>
        </a-flex>
        <a-button @click="handleBack" type="primary" ghost style="width: 80px; padding: 0">{{ getCommon('back') }}</a-button>
        <a-button type="primary" style="width: 130px; padding: 0" :loading="submitLoading" @click="handleSubmit">
          {{ getI18nLabel('submit', 1) }}
        </a-button>
      </a-flex>
    </a-flex>
    <a-flex vertical class="job-edit-content">
      <job-form ref="resumeFormRef" v-model:form="form" :loading="showSkeleton" :jobTitleDisabled="isJobTitleDisabled" />

      <a-flex vertical gap="24" class="mui-tips">
        <a-flex align="center" gap="5">
          <span class="mui-primary-text"><svg-icon name="tips" /></span>
          <div class="mui-tips-title">{{ getLabel('tipsTitle') }}</div>
        </a-flex>
        <a-flex gap="8" vertical>
          <div class="mui-tips-desc">{{ $t('enterpriseCenter.jobRecords.tips.0') }}</div>
          <div class="mui-tips-desc">{{ $t('enterpriseCenter.jobRecords.tips.1') }}</div>
          <div class="mui-tips-desc">{{ $t('enterpriseCenter.jobRecords.tips.2') }}</div>
          <div class="mui-tips-desc">{{ $t('enterpriseCenter.jobRecords.tips.3') }}</div>
          <div class="mui-tips-desc">{{ $t('enterpriseCenter.jobRecords.tips.4') }}</div>
        </a-flex>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { addDraftJob, addJob, getJobDetail, editJob } from '/@/api/job';
  import { themeColors } from '/@/theme/color';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import JobForm from '../components/job-form.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { JOB_STATUS_ENUM } from '/@/constants/api-const';
  import { useUserStore } from '/@/store/modules/system/user';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const { getLabel, getCommon } = useI18nText({ local: 'enterpriseCenter.jobEdit' });
  const getI18nLabel = (name, ...arg) => getLabel(name, ...arg);

  const createDefaultForm = () => ({
    jobTitle: undefined,
    expiredAt: null,
    industry: undefined,
    jobCategory: undefined,
    jobTag: undefined,
    salaryRange: undefined,
    recruitmentNumber: undefined,
    jobNature: undefined,
    workLocation: undefined,
    workExperience: undefined,
    education: undefined,
    languageRequirements: undefined,
    nationalityRequirements: undefined,
    jobDescription: undefined,
  });

  const form = ref(createDefaultForm());
  const resumeFormRef = ref();

  const isAutoLoading = ref(false);
  const isSaving = ref(false);
  const submitLoading = ref(false);
  const isInitializing = ref(true);

  const initialId = route.query?.id ? Number(route.query.id) : undefined;
  const jobId = ref(Number.isFinite(initialId) ? initialId : undefined);

  const isEditMode = computed(() => Boolean(jobId.value));

  const jobStatus = ref(undefined);
  const isJobTitleDisabled = computed(() => {
    // Published jobs (status === 1 means recruiting) cannot have their job title changed
    return jobStatus.value === 1;
  });

  const showAutoSaveSpinner = computed(() => isAutoLoading.value || isSaving.value);
  const autoSaveMessageIndex = computed(() => (showAutoSaveSpinner.value ? 0 : 1));
  const showSkeleton = computed(() => isEditMode.value && isAutoLoading.value && isInitializing.value);

  const indicator = h(LoadingOutlined, {
    style: {
      fontSize: '12px',
      color: themeColors[0].subColor,
    },
    spin: true,
  });

  let autoSaveTimer = null;
  let autoSaveQueued = false;
  let lastSavedSignature = '';

  const toNullable = (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  };

  const cleanPayload = (payload) => {
    const next = {};
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        next[key] = value;
      }
    });
    return next;
  };

  const buildPayload = (source = form.value) => {
    const payload = {
      jobTitle: source.jobTitle?.trim() || '',
      industry: toNullable(source.industry),
      jobCategory: toNullable(source.jobCategory),
      jobNature: toNullable(source.jobNature),
      workLocation: toNullable(source.workLocation),
      jobDescription: source.jobDescription, // Pass the rich-text Delta object directly, no trim needed
      recruitmentNumber: toNullable(source.recruitmentNumber),
      salaryRange: toNullable(source.salaryRange),
      workExperience: toNullable(source.workExperience),
      education: toNullable(source.education),
      languageRequirements: Array.isArray(source.languageRequirements) ? source.languageRequirements : [],
      nationalityRequirements: Array.isArray(source.nationalityRequirements) ? source.nationalityRequirements : [],
    };
    if (source.expiredAt) {
      payload.expiredAt = dayjs(source.expiredAt).format('YYYY-MM-DD');
    }
    return cleanPayload(payload);
  };

  const normalizeJobDetail = (detail) => {
    if (!detail) return {};
    const normalized = { ...detail };
    normalized.expiredAt = normalized.expiredAt || normalized.deadTime || normalized.deadline || normalized.deadLine || null;
    normalized.jobNature = normalized.jobNature || normalized.jobType;
    normalized.workLocation = normalized.workLocation || normalized.city;
    normalized.workExperience = normalized.workExperience || normalized.workYearsMin;
    normalized.education = normalized.education || normalized.educationRequired;

    // Handle the rich-text field: if the backend returns a JSON string, parse it into a Delta object
    if (normalized.jobDescription || normalized.description) {
      const sourceDesc = normalized.jobDescription || normalized.description;
      if (typeof sourceDesc === 'string') {
        try {
          normalized.jobDescription = JSON.parse(sourceDesc);
        } catch (error) {
          console.error('[normalizeJobDetail] failed to parse jobDescription', error);
          normalized.jobDescription = undefined;
        }
      } else {
        normalized.jobDescription = sourceDesc;
      }
    } else {
      normalized.jobDescription = undefined;
    }

    if (!Array.isArray(normalized.languageRequirements)) {
      normalized.languageRequirements = [];
    }

    if (!normalized.nationalityRequirements) {
      normalized.nationalityRequirements = [];
    }
    return normalized;
  };

  const applyFormData = (detail, keepInitializing = false) => {
    if (!keepInitializing) {
      isInitializing.value = true;
    }
    const normalized = normalizeJobDetail(detail);
    const next = {
      ...createDefaultForm(),
      ...normalized,
    };
    next.expiredAt = next.expiredAt ? dayjs(next.expiredAt) : null;
    if (!Array.isArray(next.languageRequirements)) {
      next.languageRequirements = [];
    }
    if (!Array.isArray(next.nationalityRequirements)) {
      if (next.nationalityRequirements) {
        next.nationalityRequirements = [next.nationalityRequirements];
      } else {
        next.nationalityRequirements = [];
      }
    }

    form.value = next;
    lastSavedSignature = JSON.stringify(buildPayload(next));
    isInitializing.value = false;
    autoSaveQueued = false;
    window.clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  };

  const loadJobDetail = async () => {
    if (!jobId.value) {
      // New job: default deadline is 31 days after the publish date
      const defaultExpiredAt = dayjs().add(1, 'month');
      applyFormData({ expiredAt: defaultExpiredAt.format('YYYY-MM-DD') });
      jobStatus.value = undefined;
      return;
    }
    isInitializing.value = true;
    isAutoLoading.value = true;
    try {
      const data = await getJobDetail(jobId.value);
      jobStatus.value = data?.status;
      applyFormData(data, true);
    } finally {
      isAutoLoading.value = false;
      isInitializing.value = false;
    }
  };

  const saveJob = async ({ force = false, showMessage = false, messageType } = {}) => {
    const payload = buildPayload();
    const signature = JSON.stringify(payload);
    if (autoSaveQueued) {
      isAutoLoading.value = true;
    }
    if (!force && signature === lastSavedSignature) {
      if (!autoSaveQueued) {
        isAutoLoading.value = false;
      }
      return { success: true, id: jobId.value };
    }
    const result = { success: false, id: jobId.value };
    isSaving.value = true;
    let currentId = jobId.value;
    if (!jobId.value) {
      // New job: create a draft
      const data = await addDraftJob(payload);
      currentId = data?.id ?? data;
      if (currentId) {
        jobId.value = currentId;
        jobStatus.value = JOB_STATUS_ENUM.DRAFT.value;
        await router.replace({ name: 'job-edit', query: { id: currentId } });
      }
    } else {
      const isDraft = jobStatus.value === JOB_STATUS_ENUM.DRAFT.value;
      // Drafts allow auto-save; non-drafts only save when forced
      if (isDraft || force) {
        await editJob(jobId.value, payload);
      } else {
        if (!autoSaveQueued) {
          isAutoLoading.value = false;
        }
        isSaving.value = false;
        return result;
      }
    }
    if (!jobId.value && !currentId) {
      isSaving.value = false;
      if (!autoSaveQueued) {
        isAutoLoading.value = false;
      }
      return result;
    }
    lastSavedSignature = signature;
    result.success = true;
    result.id = jobId.value || currentId;
    if (showMessage && messageType) {
      message.success(getI18nLabel(`message.${messageType}`));
    }
    isSaving.value = false;
    if (!autoSaveQueued) {
      isAutoLoading.value = false;
    }
    return result;
  };

  const runAutoSave = async () => {
    if (!autoSaveQueued) return;
    if (isSaving.value) {
      autoSaveTimer = window.setTimeout(runAutoSave, 400);
      return;
    }
    autoSaveQueued = false;
    await saveJob();
    if (autoSaveQueued) {
      runAutoSave();
    }
  };

  const scheduleAutoSave = () => {
    if (isInitializing.value) return;
    // Only new or draft jobs are auto-saved
    if (jobId.value && jobStatus.value !== JOB_STATUS_ENUM.DRAFT.value) return;
    autoSaveQueued = true;

    window.clearTimeout(autoSaveTimer);
    autoSaveTimer = window.setTimeout(runAutoSave, 800);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    try {
      submitLoading.value = true;
      await resumeFormRef.value?.validate?.();
      const isDraftJobWithId = jobId.value && jobStatus.value === JOB_STATUS_ENUM.DRAFT.value;
      if (isDraftJobWithId) {
        const payload = { id: jobId.value, ...buildPayload() };
        await addJob(payload);
        message.success(getI18nLabel('message.publishSuccess'));
        router.back();
        return;
      }
      const editingBeforeSubmit = isEditMode.value;
      const result = await saveJob({
        force: true,
        showMessage: true,
        messageType: editingBeforeSubmit ? 'updateSuccess' : 'publishSuccess',
      });
      router.back();
      if (!editingBeforeSubmit && result.success && result.id) {
        await loadJobDetail();
      }
    } finally {
      submitLoading.value = false;
    }
  };

  watch(
    form,
    () => {
      scheduleAutoSave();
    },
    { deep: true }
  );

  onMounted(loadJobDetail);

  onBeforeUnmount(() => {
    window.clearTimeout(autoSaveTimer);
  });
</script>

<style scoped lang="less">
  .job-edit {
    .job-edit-head {
      padding: 16px 40px;
      border-bottom: 1px solid @border-color;
      .title {
        font-size: 20px;
        color: @font-primary-color;
      }
      .label {
        font-size: 12px;
        color: @error-color;
      }
      .radio {
        height: 17px;
      }
      .auto-loading {
        font-size: 12px;
        color: @font-tip-color;
      }
    }
    .job-edit-content {
      padding: 30px 40px;
    }
  }
</style>

<route>
{
auth: 'job-edit',
parentId: 'enterprise-center',
hideInMenu: true
}
</route>
