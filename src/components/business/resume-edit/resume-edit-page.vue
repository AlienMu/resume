<template>
  <div class="resume-edit">
    <a-flex class="resume-edit-head" justify="space-between" align="center">
      <a-flex align="flex-end" gap="26">
        <div class="title">{{ getLabel('title') }}</div>
        <div class="label">{{ getLabel('hasOpen') }}</div>
        <div class="radio">
          <a-radio-group v-model:value="form.isPublic">
            <m-radio :value="PUBLIC_STATUS_ENUM.PUBLIC.value">{{ getCommon('hideStatus', 2) }}</m-radio>
            <m-radio :value="PUBLIC_STATUS_ENUM.PRIVATE.value">{{ getCommon('hideStatus', 1) }}</m-radio>
          </a-radio-group>
        </div>
      </a-flex>
      <a-flex gap="13">
        <a-flex align="center" gap="8">
          <a-spin :indicator="indicator" v-if="showAutoSaveSpinner" />
          <span class="auto-loading">{{ getLabel('autoLoading', autoSaveMessageIndex) }}</span>
        </a-flex>
        <a-button type="primary" ghost style="width: 80px; padding: 0" @click="handleBack">{{ getLabel('back') }}</a-button>
        <a-button type="primary" style="width: 130px; padding: 0" :loading="publishLoading" @click="handlePublish">{{
          getLabel('publishButton')
        }}</a-button>
      </a-flex>
    </a-flex>
    <a-flex vertical class="resume-edit-content" gap="30">
      <div class="avatar-edit" @click="triggerAvatarUpload">
        <input ref="avatarFileRef" class="avatar-upload-input" type="file" accept="image/*" @change="handleAvatarUpload" />
        <div class="avatar-edit-image">
          <a-spin :spinning="avatarUploading" :tip="getCommon('loading')" :indicator="indicator">
            <a-avatar :src="form.avatar" :size="140">
              <span>{{ getLabel('uploadAvatar') }}</span>
              <template #previewMask>
                <a-flex gap="6" align="center">
                  <CameraOutlined style="font-size: 16px" />
                  <span>{{ getLabel('avatarEdit') }}</span>
                </a-flex>
              </template>
            </a-avatar>
          </a-spin>
        </div>
        <span class="avatar-edit-icon"><CameraFilled /></span>
      </div>
      <div class="resume-form">
        <resume-form ref="resumeFormRef" v-model:form="form" :context="props.context" @change="handleFormChange" />
      </div>
    </a-flex>

    <image-cropper ref="cropperRef" @cropped="handleAvatarCropped" />
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { CameraFilled, CameraOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import MRadio from '/@/components/mui/m-radio/m-radio.vue';
  import { PUBLIC_STATUS_ENUM, RESUME_STATUS_ENUM, USER_TYPE_ENUM } from '/@/constants/api-const';
  import { themeColors } from '/@/theme/color';
  import ResumeForm from './resume-form.vue';
  import ImageCropper from '/@/components/support/image-cropper/image-cropper.vue';
  import { createResume, createDraftResume, getResumeDetail, setResumePublic, updateResume } from '/@/api/resume';
  import { createResume_1, getPriceAdjustmentStatus, requestPriceAdjustment, updateResume_1 } from '/@/api/invite';
  import { uploadFile } from '/@/api/upload';
  import { Delta } from '@vueup/vue-quill';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { getAccountSettings } from '/@/api/account';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel, getCommon } = useI18nText({ local: 'userCenter.content.resumeEdit' });
  const userStore = useUserStore();

  const props = defineProps({
    context: {
      type: String,
      default: 'user',
    },
  });

  const CONTEXT_CONFIG = {
    user: {
      editRouteName: 'resume-edit',
      listRouteName: 'resume',
      createResume: (payload) => createResume(payload),
      updateResume: (id, payload) => updateResume(id, payload),
    },
    invite: {
      editRouteName: 'invite-resume-edit',
      listRouteName: 'resumeManage',
      createResume: (payload) => createResume_1(payload),
      updateResume: (id, payload) => updateResume_1(id, payload),
    },
  };

  const router = useRouter();
  const route = useRoute();
  const resolvedContext = computed(() => (props.context === 'invite' ? 'invite' : 'user'));
  const contextConfig = computed(() => CONTEXT_CONFIG[resolvedContext.value]);

  const isAutoLoading = ref(false);
  const isSaving = ref(false);
  const publishLoading = ref(false);
  const avatarUploading = ref(false);
  const applyHighValueLoading = ref(false);

  // State management helper function
  const setLoadingState = (saving, autoLoading = null) => {
    isSaving.value = saving;
    if (autoLoading !== null) {
      isAutoLoading.value = autoLoading;
    } else if (!autoSaveQueued) {
      isAutoLoading.value = saving;
    }
  };

  // Determine whether the resume can be saved
  const canSaveResume = (force = false) => {
    if (!resumeId.value) return true; // A new resume can always be saved
    const isDraft = resumeStatus.value === RESUME_STATUS_ENUM.DRAFT.value;
    return isDraft || force; // Can save when in draft status or when forced
  };

  const HIGH_VALUE_STATUS = {
    NONE: 0,
    PENDING: 1,
    APPROVED: 2,
  };

  const highValueStatus = ref(HIGH_VALUE_STATUS.NONE);
  const basePrice = ref(20);
  const highPrice = ref(40);

  const indicator = h(LoadingOutlined, {
    style: {
      fontSize: '12px',
      color: themeColors[0].subColor,
    },
    spin: true,
  });

  const createDefaultForm = () => ({
    phonePublic: PUBLIC_STATUS_ENUM.PUBLIC.value,
    isPublic: PUBLIC_STATUS_ENUM.PUBLIC.value,
  });

  const form = ref(createDefaultForm());
  const resumeFormRef = ref();
  const cropperRef = ref();
  const avatarFileRef = ref();

  const resumeId = ref(route.query.id ? Number(route.query.id) || undefined : undefined);
  const resumeStatus = ref(null); // Resume status

  const isInitializing = ref(true);
  let autoSaveTimer = null;
  let autoSaveQueued = false;
  let lastSavedSignature = '';

  const currentRouteName = computed(() => route.name || contextConfig.value.editRouteName);

  const showAutoSaveSpinner = computed(() => isAutoLoading.value);
  const autoSaveMessageIndex = computed(() => (showAutoSaveSpinner.value ? 0 : 1));

  const triggerAvatarUpload = () => {
    avatarFileRef.value?.click();
  };

  const resetFileInput = () => {
    if (avatarFileRef.value) {
      avatarFileRef.value.value = '';
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      message.warning(getLabel('messages.imageTypeError'));
      resetFileInput();
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.warning(getLabel('messages.imageSizeError'));
      resetFileInput();
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperRef.value?.handleOpen?.(e.target?.result);
      resetFileInput();
    };
    reader.readAsDataURL(file);
  };

  const dataUrlToFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch?.[1] || 'image/png';
    const binary = atob(arr[1]);
    const len = binary.length;
    const u8arr = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      u8arr[i] = binary.charCodeAt(i);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  const handleAvatarCropped = async (dataUrl) => {
    if (!dataUrl) return;
    try {
      avatarUploading.value = true;
      const file = dataUrlToFile(dataUrl, `resume-avatar-${Date.now()}.png`);
      const result = await uploadFile({ file });
      form.value.avatar = result?.url || '';
      scheduleAutoSave();
    } finally {
      avatarUploading.value = false;
    }
  };

  const buildPayload = (targetForm = form.value) => {
    return {
      ...targetForm,
      name: targetForm.name ?? '',
      phone: targetForm.phone ?? '',
      phonePublic: targetForm.phonePublic === undefined ? PUBLIC_STATUS_ENUM.PRIVATE.value : Number(targetForm.phonePublic),
      experienceContent: targetForm.experienceContent ? JSON.stringify(targetForm.experienceContent) : undefined,
      resumeFile: targetForm.resumeFile ? [targetForm.resumeFile] : undefined,
    };
  };

  const saveResume = async ({ force = false, showMessage = false } = {}) => {
    const payload = buildPayload();
    const signature = JSON.stringify(payload);

    // Skip when content is unchanged and save is not forced
    if (!force && signature === lastSavedSignature) {
      setLoadingState(false);
      return;
    }

    // Check whether saving is allowed
    if (!canSaveResume(force)) {
      setLoadingState(false);
      return;
    }

    setLoadingState(true);

    try {
      if (!resumeId.value) {
        // Create a new resume
        const data = await createDraftResume(payload);
        const newId = data?.id ?? data;
        if (newId) {
          resumeId.value = newId;
          resumeStatus.value = RESUME_STATUS_ENUM.DRAFT.value;
          router.replace({ name: currentRouteName.value, query: { id: newId } });
        }
      } else {
        // Update an existing resume
        await contextConfig.value.updateResume(resumeId.value, payload);
      }
      lastSavedSignature = signature;
      if (showMessage) {
        message.success(getCommon('messages.success.save'));
      }
    } finally {
      setLoadingState(false);
    }
  };

  const runAutoSave = async () => {
    if (!autoSaveQueued || isSaving.value) return;
    autoSaveQueued = false;
    await saveResume();
    // If another auto-save request came in, continue processing
    if (autoSaveQueued) {
      runAutoSave();
    }
  };

  const scheduleAutoSave = () => {
    if (isInitializing.value) return;
    // Auto-save only for new resumes or draft status
    if (resumeId.value && resumeStatus.value !== RESUME_STATUS_ENUM.DRAFT.value) {
      return;
    }
    autoSaveQueued = true;

    window.clearTimeout(autoSaveTimer);
    autoSaveTimer = window.setTimeout(runAutoSave, 5000);
  };

  const handleFormChange = () => {
    scheduleAutoSave();
  };

  const normalizeResumeResponse = (detail) => {
    if (!detail) return {};
    if (detail.basic) return detail.basic;
    return detail;
  };

  const applyResumeData = (data) => {
    isInitializing.value = true;
    const normalized = normalizeResumeResponse(data);
    const next = {
      ...createDefaultForm(),
      ...normalized,
      experienceContent: data.experienceContent ? new Delta(JSON.parse(data.experienceContent)) : undefined,
    };
    next.phonePublic = next.phonePublic === undefined ? PUBLIC_STATUS_ENUM.PRIVATE.value : Number(next.phonePublic);

    form.value = next;
    // Save the resume status
    resumeStatus.value = typeof data.status === 'number' ? data.status : data.basic?.status !== undefined ? data.basic.status : null;

    // Handle displaying existing resume files
    if (data.resumeFile && Array.isArray(data.resumeFile) && data.resumeFile.length > 0) {
      resumeFormRef.value?.setResumeFiles(data.resumeFile);
    }

    lastSavedSignature = JSON.stringify(buildPayload(next));
    isInitializing.value = false;
  };

  const loadResume = async () => {
    if (!resumeId.value) {
      // When creating a new resume, auto-fill the account info from registration
      // Only auto-fill the info when the user is a job seeker
      const defaultData = {};
      if (userStore.userType === USER_TYPE_ENUM.PERSON.value) {
        defaultData.phone = userStore.phone || '';
        defaultData.email = userStore.email || '';
        defaultData.phoneCountryCode = userStore.countryCode;
        defaultData.telegram = userStore.telegramAccount;
      } else {
        defaultData.phone = '';
        defaultData.email = '';
        defaultData.phoneCountryCode = undefined;
        defaultData.telegram = '';
      }

      applyResumeData(defaultData);
      return;
    }
    try {
      isAutoLoading.value = true;
      const data = await getResumeDetail(resumeId.value);
      applyResumeData(data);
    } catch (error) {
      applyResumeData({});
    } finally {
      isAutoLoading.value = false;
    }
  };

  const handleBack = () => {
    router.push({ name: contextConfig.value.listRouteName });
  };

  const handlePublish = async () => {
    try {
      publishLoading.value = true;
      await resumeFormRef.value?.validate();
      window.clearTimeout(autoSaveTimer);
      autoSaveQueued = false;
      isAutoLoading.value = true;

      if (!resumeId.value) {
        message.error(getCommon('messages.failed.save'));
        return;
      }
      const payload = buildPayload(form.value, PUBLIC_STATUS_ENUM.PUBLIC.value);
      if (resumeStatus.value === RESUME_STATUS_ENUM.DRAFT.value) {
        await contextConfig.value.createResume({ id: resumeId.value, ...payload });
      } else {
        await contextConfig.value.updateResume(resumeId.value, payload);
      }
      isInitializing.value = true;

      lastSavedSignature = JSON.stringify(buildPayload(form.value));
      isInitializing.value = false;
      message.success(getLabel('messages.publishSuccess'));
      router.back();
    } finally {
      publishLoading.value = false;
    }
  };

  const loadPriceAdjustmentStatus = async () => {
    if (!resumeId.value) return;
    try {
      const res = await getPriceAdjustmentStatus({ resumeId: resumeId.value });
      const statusData = res?.data || res;
      if (!statusData) return;
      basePrice.value = typeof statusData.currentDownloadPrice === 'number' ? statusData.currentDownloadPrice : basePrice.value;
      // Use the requested price from the API if provided, otherwise default to 2x the current price
      highPrice.value = typeof statusData.requestedPrice === 'number' ? statusData.requestedPrice : Math.max(basePrice.value * 2, basePrice.value);

      if (statusData.status === 0 && statusData.hasPendingApplication) {
        highValueStatus.value = HIGH_VALUE_STATUS.PENDING;
      } else if (statusData.status === 1) {
        highValueStatus.value = HIGH_VALUE_STATUS.APPROVED;
      } else {
        highValueStatus.value = HIGH_VALUE_STATUS.NONE;
      }
    } catch (error) {
      // A status load failure does not affect the main resume-editing flow; silent or light notice is fine
      // Here we choose to fail silently so the user's workflow is not interrupted
      console.warn('loadPriceAdjustmentStatus error', error);
    }
  };

  const handleApplyHighValue = async () => {
    if (!resumeId.value) {
      message.warning(getCommon('messages.failed.save'));
      return;
    }
    try {
      applyHighValueLoading.value = true;
      await requestPriceAdjustment({
        resumeId: resumeId.value,
        requestedPrice: highPrice.value,
      });
      await loadPriceAdjustmentStatus();
      highValueStatus.value = HIGH_VALUE_STATUS.PENDING;
      message.success(getLabel('messages.highValueApplySuccess'));
    } finally {
      applyHighValueLoading.value = false;
    }
  };

  onMounted(() => {
    loadResume();
  });

  onBeforeUnmount(() => {
    window.clearTimeout(autoSaveTimer);
  });
</script>

<style scoped lang="less">
  .resume-edit {
    padding: 0 4px;

    .resume-edit-head {
      padding: 16px;
      .title {
        font-size: 20px;
        color: @font-primary-color;
      }
      .label {
        font-size: 14px;
        color: @font-primary-color;
      }
      .radio {
        height: 17px;
      }
      .auto-loading {
        font-size: 12px;
        color: @font-tip-color;
      }
    }
    .resume-edit-content {
      background: linear-gradient(180deg, rgba(235, 243, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
      border-radius: 7.35px;
      .avatar-edit {
        align-self: center;
        position: relative;
        margin: 40px 0 10px 0;
        cursor: pointer;
        .avatar-upload-input {
          display: none;
        }
        .avatar-edit-image {
          border-radius: 50%;
          background: rgba(204, 204, 204, 1);
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
        }
        .avatar-edit-icon {
          position: absolute;
          line-height: 16px;
          padding: 8px;
          background: @base-bg-color;
          font-size: 18px;
          color: @primary-color;
          border: 1px solid rgba(231, 231, 231, 1);
          border-radius: 50%;
          bottom: 0;
          right: 0;
        }
      }
    }
    .resume-form {
      padding: 0 15px;
    }
    .high-value-banner {
      margin: 24px 16px;
      border-radius: 4px;
      padding: 18px 20px;
      background: rgba(240, 244, 247, 1);
      .high-value-label {
        font-size: 14px;
        color: @font-primary-color;
      }
      .high-value-price {
        font-size: 16px;
        font-weight: 600;
        color: @font-primary-color;
      }
      .high-value-status {
        font-size: 14px;
        &.primary {
          color: @primary-color;
        }
      }
      :deep(.ant-btn-primary) {
        min-width: 140px;
      }
    }
  }
</style>
