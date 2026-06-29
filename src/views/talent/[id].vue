<template>
  <div class="talent-detail">
    <talent-banner />
    <div class="talent-detail-content">
      <!-- Top info section -->
      <a-flex align="center" justify="space-between" v-if="!isDetailLoading">
        <a-flex gap="30" align="center">
          <a-avatar :size="100" :src="detailInfo.avatar" style="background: rgba(0, 0, 0, 0.25); border: none" />
          <a-flex vertical gap="12">
            <span style="font-size: 32px" class="mui-title-text mui-bold">{{ detailInfo.name }}</span>
            <a-flex gap="8">
              <span class="mui-right-line mui-title-text">{{ detailInfo.educationShow }}</span>
              <span class="mui-right-line mui-title-text">{{ getFormatText(detailInfo.age, 'age') }}</span>
              <span class="mui-right-line mui-title-text">{{ muiEnumPlugin.getDescByValue('GENDER_ENUM', detailInfo.gender) }}</span>
              <span class="mui-right-line mui-title-text">{{ detailInfo.workYearsShow }}</span>
              <span class="mui-right-line mui-title-text">{{ getLabel('detail.nationality', { text: detailInfo.nationalityShow }) }}</span>
              <span class="mui-right-line mui-title-text">{{ getLabel('detail.currentLocation', { text: detailInfo.currentLocationShow }) }}</span>
            </a-flex>
            <a-flex gap="12">
              <span class="mui-title-text">{{ getLabel('detail.jobStatus') }}</span>
              <span class="mui-sub-color mui-bold">{{ detailInfo.jobStatusShow }}</span>
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex align="center" gap="40" v-if="!isDetailLoading">
          <div class="mui-desc-text mui-font-size-12">
            {{ detailInfo.updatedAt ? getTimeComparison(detailInfo.updatedAt) : '-' }}
          </div>
          <a-button
            type="primary"
            style="background: rgba(240, 244, 247, 1); padding: 0 18px; border-radius: 8px; box-shadow: none"
            @click="handleReport"
          >
            <a-flex gap="13" align="center" style="color: rgba(92, 115, 148, 1)">
              <span style="font-size: 16px; height: 1em; line-height: 1em"><svg-icon name="notice" /></span>
              <span>{{ getLabel('detail.report') }}</span>
            </a-flex>
          </a-button>
        </a-flex>
      </a-flex>
      <!-- Top info skeleton -->
      <a-flex align="center" justify="space-between" v-else class="talent-detail-skeleton__header">
        <a-flex gap="30" align="center">
          <a-skeleton-avatar :size="100" shape="circle" active />
          <a-flex vertical gap="12">
            <a-skeleton-input active size="large" class="talent-detail-skeleton__name" />
            <a-flex gap="8" class="talent-detail-skeleton__info-row">
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
            </a-flex>
            <a-flex gap="12" class="talent-detail-skeleton__info-row">
              <a-skeleton-input active size="small" class="talent-detail-skeleton__info-item" />
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex align="center" gap="40">
          <a-skeleton-input active size="small" class="talent-detail-skeleton__time" />
          <a-skeleton-button active class="talent-detail-skeleton__button" />
        </a-flex>
      </a-flex>

      <a-flex vertical gap="30" class="body">
        <!-- Contact section -->
        <a-flex vertical gap="20" v-if="!isDetailLoading">
          <a-flex justify="space-between">
            <a-flex align="center" gap="10">
              <span class="title">{{ getLabel('detail.steps.0', 0) }}</span>
              <span v-if="contactMethodNote" class="mui-tip-text mui-font-size-12">{{ contactMethodNote }}</span>
            </a-flex>
            <span class="mui-font-size-12 mui-error-text">{{ getLabel('detail.steps.0', 2) }}</span>
          </a-flex>
          <div class="contact">
            <a-flex style="width: 100%" justify="space-between" align="center">
              <a-flex align="center" gap="50">
                <a-flex v-if="hasValue(detailInfo.phone)" gap="12">
                  <span class="icon"><svg-icon name="phone" /></span>
                  <span>{{ detailInfo.phone }}</span>
                </a-flex>
                <a-flex v-if="hasValue(detailInfo.telegram)" gap="12" align="center">
                  <span class="icon"><svg-icon name="telegram" /></span>
                  <span>{{ detailInfo.telegram }}</span>
                  <a-button
                    target="_blank"
                    style="padding: 6px 0"
                    type="link"
                    v-if="!showViewContactButton"
                    :href="`https://t.me/${detailInfo.telegram.substring(1)}`"
                  >
                    {{ getLabel('detail.sendContact') }}
                  </a-button>
                </a-flex>
                <a-flex v-if="hasValue(detailInfo.email)" gap="12">
                  <span class="icon"><svg-icon name="email" /></span>
                  <span>{{ detailInfo.email }}</span>
                </a-flex>
                <a-flex v-if="hasValue(detailInfo.otherAccountValue)" gap="12">
                  <span>{{ detailInfo.otherAccountShow }}</span>
                  <span>{{ detailInfo.otherAccountValue }}</span>
                </a-flex>
              </a-flex>
              <a-button v-if="showViewContactButton" type="primary" style="width: 130px; padding: 0" @click="handleViewContact">
                {{ getLabel('detail.viewContact') }}
              </a-button>
            </a-flex>
          </div>
        </a-flex>
        <!-- Contact skeleton -->
        <a-flex vertical gap="20" v-else class="talent-detail-skeleton__contact">
          <a-flex justify="space-between">
            <a-flex align="center" gap="10">
              <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-title-1" />
              <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-title-2" />
            </a-flex>
            <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-title-3" />
          </a-flex>
          <div class="contact">
            <a-flex style="width: 100%" justify="space-between" align="center">
              <a-flex align="center" gap="50" class="talent-detail-skeleton__contact-items">
                <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-item-1" />
                <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-item-2" />
                <a-skeleton-input active size="small" class="talent-detail-skeleton__contact-item-3" />
              </a-flex>
              <a-skeleton-button active class="talent-detail-skeleton__button talent-detail-skeleton__contact-button" />
            </a-flex>
          </div>
        </a-flex>

        <!-- Job intention section -->
        <a-flex vertical gap="20" v-if="!isDetailLoading">
          <div class="title">{{ getLabel('detail.steps.1') }}</div>
          <a-flex gap="30" wrap="wrap">
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.7') }}</span>
              <span class="mui-title-text">{{ detailInfo.industryShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.0') }}</span>
              <span class="mui-title-text">{{ detailInfo.jobCategoryShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.1') }}</span>
              <span class="mui-title-text">{{ detailInfo.currentSalaryShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.2') }}</span>
              <span class="mui-title-text">{{ detailInfo.expectedSalaryShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.3') }}</span>
              <span class="mui-title-text">{{ detailInfo.abroadWillingnessShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.4') }}</span>
              <span class="mui-title-text">{{ detailInfo.workStyleShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.5') }}</span>
              <span class="mui-title-text">{{ detailInfo.currentLocationShow }}</span>
            </a-flex>
            <a-flex>
              <span class="mui-desc-text"> {{ getLabel('detail.intention.6') }}</span>
              <span class="mui-title-text">{{ detailInfo.expectedCountryShow }}</span>
            </a-flex>
          </a-flex>
        </a-flex>
        <!-- Job intention skeleton -->
        <a-flex vertical gap="20" v-else class="talent-detail-skeleton__intention">
          <a-skeleton-input active size="small" class="talent-detail-skeleton__intention-title" />
          <a-flex gap="30" wrap="wrap" class="talent-detail-skeleton__intention-items">
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
            <a-skeleton-input active size="small" />
          </a-flex>
        </a-flex>

        <!-- Work experience section -->
        <a-flex vertical gap="20" v-if="!isDetailLoading">
          <div class="title">{{ getLabel('detail.steps.2') }}</div>
          <div v-html="detailInfo.experienceContent"></div>
        </a-flex>
        <!-- Work experience skeleton -->
        <a-flex vertical gap="20" v-else class="talent-detail-skeleton__experience">
          <a-skeleton-input active size="small" class="talent-detail-skeleton__experience-title" />
          <a-skeleton :rows="6" active />
        </a-flex>

        <!-- Resume attachment section -->
        <a-flex vertical gap="20" v-if="!isDetailLoading && detailInfo.resumeFile?.length > 0">
          <div class="title">{{ getLabel('detail.steps.3') }}</div>
          <a-flex
            v-for="(item, index) in detailInfo.resumeFile"
            :key="item.url || index"
            gap="20"
            class="upload-item"
            align="center"
            justify="space-between"
          >
            <a-flex gap="20" align="center" style="flex: 1">
              <div style="flex-shrink: 0">
                <svg-icon name="file" class="upload-icon" />
              </div>
              <a-flex class="upload-item-text" vertical style="flex: 1">
                <a-typography-text class="strong" :ellipsis="{ tooltip: true }" :content="item?.fileName" />
                <a-flex gap="5">
                  <span>
                    {{ item?.fileSize ? `${item.fileSize}mb` : '-' }}
                  </span>
                </a-flex>
              </a-flex>
            </a-flex>
            <a-button type="link" size="small" shape="circle" class="remove" @click="handleDownload(item)">
              {{ getCommon('download') }}
            </a-button>
          </a-flex>
        </a-flex>
        <!-- Resume attachment skeleton -->
        <a-flex vertical gap="20" v-else-if="isDetailLoading" class="talent-detail-skeleton__resume-file">
          <a-skeleton-input active size="small" class="talent-detail-skeleton__resume-file-title" />
          <a-flex gap="20" class="upload-item" align="center" justify="space-between">
            <a-flex gap="20" align="center">
              <a-skeleton-avatar :size="38" shape="square" active />
              <a-flex vertical gap="5" class="talent-detail-skeleton__file-info">
                <a-skeleton-input active size="small" class="talent-detail-skeleton__file-name" />
                <a-skeleton-input active size="small" class="talent-detail-skeleton__file-size" />
              </a-flex>
            </a-flex>
            <a-skeleton-button active class="talent-detail-skeleton__download-btn" />
          </a-flex>
        </a-flex>
      </a-flex>

      <!-- Tips section -->
      <div class="tips" v-if="!isDetailLoading">
        <span class="mui-title-color mui-font-size-12 mui-bold">{{ getLabel('detail.tips', 0) }}</span>
        <span class="mui-desc-text mui-font-size-12">{{ getLabel('detail.tips', 1) }}</span>
        <span class="mui-desc-text mui-font-size-12">{{ getLabel('detail.tips', 2) }}</span>
      </div>
      <!-- Tips skeleton -->
      <div class="tips talent-detail-skeleton__tips" v-else>
        <a-skeleton-input active size="small" class="talent-detail-skeleton__tip-1" />
        <a-skeleton-input active size="small" class="talent-detail-skeleton__tip-2" />
        <a-skeleton-input active size="small" class="talent-detail-skeleton__tip-3" />
      </div>
    </div>
  </div>
  <report-resume ref="reportResumeRef" />
  <recharge-modal ref="rechargeModalRef" />
  <view-resume-modal ref="viewResumeModalRef" @success="handleViewResumeSuccess" />
</template>

<script setup>
  import TalentBanner from '/@/views/talent/components/talent-banner.vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { getResumeDetail } from '/@/api/resume';
  import { getFormatText, getFileName } from '/@/utils/str-util';
  import { muiEnumPlugin } from '/@/utils/desc-util';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { getTimeComparison } from '/@/utils/date-util';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import ReportResume from '/@/views/talent/components/report-resume.vue';
  import RechargeModal from '/@/views/talent/components/recharge-modal.vue';
  import ViewResumeModal from '/@/views/talent/components/view-resume-modal.vue';
  import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
  import { Delta } from '@vueup/vue-quill';

  const route = useRoute();

  const createDefaultDetail = () => ({
    avatar: '',
    name: '',
    education: '',
    age: '',
    gender: undefined,
    workYears: '',
    nationality: '',
    currentLocation: '',
    jobStatus: undefined,
    updatedAt: '',
    phone: '',
    telegram: '',
    email: '',
    otherAccountValue: '',
    otherAccountShow: '',
    jobTitle: '',
    currentSalary: '',
    expectedSalary: '',
    abroadWillingness: undefined,
    workStyle: undefined,
    expectedCountry: '',
    selfIntroduction: '',
    experienceContent: '',
    resumeFile: null,
    desc: '',
    isHighValue: 0,
    highValueStatus: 0,
    discountPrice: null,
    originalPrice: null,
    viewContactPrice: null,
    viewPrice: null,
    isViewContact: 0,
    isPaidView: null,
  });

  const detailInfo = ref(createDefaultDetail());

  const isDetailLoading = ref(true);

  const reportResumeRef = ref();
  const rechargeModalRef = ref();
  const viewResumeModalRef = ref();

  const { getLabel, getCommon } = useI18nText({ local: 'talent' });

  const resolveFileSize = (size) => {
    if (size === undefined || size === null || size === '') {
      return '';
    }
    if (typeof size === 'number') {
      const mb = size / (1024 * 1024);
      if (!Number.isFinite(mb)) return '';
      return mb.toFixed(2);
    }
    return String(size);
  };

  const pickFirstValid = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return '';
  };

  const isMaskedValue = (value) => {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed !== '' && /^\*+$/.test(trimmed);
  };

  const hasValue = (value) => {
    if (value === undefined || value === null) return false;

    return value !== '';
  };

  const buildResumeFileMeta = (attachment) => {
    if (!attachment) return null;
    // Support new format ResumeAttachmentDTO and legacy format (string URL)
    const url = typeof attachment === 'string' ? attachment : attachment.url;
    if (!url) return null;

    const fileName = typeof attachment === 'object' && attachment.name ? attachment.name : getFileName(url);

    const fileSize = typeof attachment === 'object' && attachment.size !== undefined ? resolveFileSize(attachment.size) : resolveFileSize(2);

    return {
      url,
      fileName,
      fileSize,
      uploadTime: typeof attachment === 'object' ? attachment.uploadTime : undefined,
    };
  };

  const normalizeResumeDetail = (detail) => {
    const source = detail || {};
    const normalized = {
      ...createDefaultDetail(),
      ...source,
    };
    normalized.updatedAt = source.updatedAt || source.updated_at || '';
    // Handle resumeFile: support array format and single object format
    if (Array.isArray(source.resumeFile)) {
      normalized.resumeFile = source.resumeFile.map(buildResumeFileMeta).filter(Boolean);
    } else if (source.resumeFile) {
      // Single object or string
      const meta = buildResumeFileMeta(source.resumeFile);
      normalized.resumeFile = meta ? [meta] : [];
    } else {
      normalized.resumeFile = [];
    }
    normalized.jobTitle = pickFirstValid(normalized.jobTitle, source.jobName);
    normalized.workStyle = pickFirstValid(normalized.workStyle, source.workType);
    normalized.currentSalary = pickFirstValid(normalized.currentSalary, source.currentMonthlySalary);
    normalized.expectedSalary = pickFirstValid(normalized.expectedSalary, source.expectedMonthlySalary);
    normalized.currentLocation = pickFirstValid(normalized.currentLocation, source.city);
    normalized.expectedCountry = pickFirstValid(normalized.expectedCountry, source.country);
    normalized.phone = pickFirstValid(normalized.phone, source.mobile);
    normalized.avatar = pickFirstValid(normalized.avatar, source.avatarUrl);
    normalized.desc = pickFirstValid(normalized.desc, source.description);

    if (source.experienceContent) {
      try {
        const parsed = typeof source.experienceContent === 'string' ? JSON.parse(source.experienceContent) : source.experienceContent;
        const data = new QuillDeltaToHtmlConverter(parsed.ops, {
          inlineStyles: true, // Use inline styles instead of class
          multiLineParagraph: false, // Disable multi-line paragraph merging
        });
        normalized.experienceContent = data.convert();
      } catch (error) {
        console.error('[normalizeResumeDetail] failed to parse experienceContent', error);
        normalized.experienceContent = '';
      }
    } else {
      normalized.experienceContent = '';
    }
    return normalized;
  };

  const hasContactInfo = computed(() => {
    const info = detailInfo.value || {};
    const hasViewedFlag = info.isViewContact === 1 || info.viewContactStatus === 1 || info.contactViewed === 1;
    return hasViewedFlag;
  });

  const showViewContactButton = computed(() => {
    const info = detailInfo.value || {};
    return info.isPaidView !== null && info.isPaidView === 0;
  });

  const contactMethodNote = computed(() => {
    const info = detailInfo.value || {};
    const availableMethods = [];

    if (hasValue(info.phone)) {
      availableMethods.push(getLabel('detail.contactMethods.phone'));
    }
    if (hasValue(info.email)) {
      availableMethods.push(getLabel('detail.contactMethods.email'));
    }
    if (hasValue(info.telegram)) {
      availableMethods.push(getLabel('detail.contactMethods.telegram'));
    }
    if (hasValue(info.otherAccountValue)) {
      availableMethods.push(info.otherAccountShow || getLabel('detail.contactMethods.other'));
    }

    if (availableMethods.length === 0) {
      return '';
    }

    return `（${getLabel('detail.contactNotePrefix')}${availableMethods.join('、')}）`;
  });

  const getDetailInfo = async () => {
    const resumeId = Number(route.params.id);
    if (!resumeId) {
      message.warning('Resume ID not found');
      detailInfo.value = createDefaultDetail();
      isDetailLoading.value = false;
      return;
    }
    isDetailLoading.value = true;
    try {
      const data = await getResumeDetail(resumeId);
      // If data is null, show the recharge prompt modal
      if (data.experienceContent === '********') {
        rechargeModalRef.value?.open?.({
          viewContactCount: 0,
        });
        detailInfo.value = createDefaultDetail();
        return;
      }
      detailInfo.value = normalizeResumeDetail(data);
      isDetailLoading.value = false;
    } catch (error) {
      // If the error indicates recharge is required or the view quota is 0, show the recharge modal
      if (error?.message?.includes('quota') || error?.message?.includes('recharge') || error?.response?.status === 403) {
        rechargeModalRef.value?.open?.({
          viewContactCount: 0,
        });
      } else {
        message.error(error?.message || 'Failed to load resume details');
      }
      detailInfo.value = createDefaultDetail();
    }
  };

  const handleDownload = (item) => {
    if (showViewContactButton.value) {
      handleViewContact();
      return;
    }
    const url = item?.url || (Array.isArray(detailInfo.value.resumeFile) && detailInfo.value.resumeFile[0]?.url);
    if (!url) {
      message.warning('No attachment available for download');
      return;
    }
    window.open(url, '_blank', 'noopener');
  };

  const handleReport = () => {
    const resumeId = Number(route.params.id);
    if (!resumeId) {
      message.warning('Resume ID not found');
      return;
    }
    reportResumeRef.value?.open?.({
      targetId: resumeId,
      context: 'resume',
    });
  };

  const handleViewContact = () => {
    const resumeId = Number(route.params.id);
    if (!resumeId) {
      message.warning('Resume ID not found');
      return;
    }
    const isHighValue = detailInfo.value?.isHighValue === 1 || detailInfo.value?.isHighValue === true || detailInfo.value?.highValueStatus === 2;
    const discountPrice = detailInfo.value?.discountPrice ?? detailInfo.value?.viewPrice ?? detailInfo.value?.viewContactPrice ?? null;
    const originalPrice = detailInfo.value?.originalPrice ?? detailInfo.value?.originalContactPrice ?? detailInfo.value?.viewOriginalPrice;

    viewResumeModalRef.value?.open?.({
      resumeId,
      isHighValue,
      discountPrice,
      originalPrice,
    });
  };

  const handleViewResumeSuccess = (payload) => {
    if (!payload?.detail) return;
    // Details returned after payment are only used to fill in contact info; no re-fetch
    detailInfo.value = normalizeResumeDetail({
      ...detailInfo.value,
      ...payload.detail,
    });
  };

  onMounted(getDetailInfo);

  watch(
    () => route.params.id,
    (newId, oldId) => {
      if (newId === oldId) return;
      getDetailInfo();
    }
  );
</script>

<style scoped lang="less">
  .talent-detail {
    max-width: 1440px;
    margin: 0 auto 20px auto;
    .talent-detail-content {
      border-radius: 8px;
      width: 100%;
      background: @base-bg-color;
      padding: 50px 138px;
    }
    .body {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid @border-color;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: @font-primary-color;
    }

    .contact {
      background: rgba(240, 244, 247, 1);
      padding: 30px 24px;
      display: flex;
      border-radius: 4px;
      align-items: center;
      gap: 50px;
      .icon {
        color: @font-desc-color;
        line-height: 1em;
        font-size: 16px;
        height: 1em;
      }
      span {
        color: @font-primary-color;
        line-height: 1em;
      }
    }
  }

  .upload-item {
    width: 380px;
    height: 80px;
    padding: 0 20px;
    border-radius: 8px;
    border: 1px solid rgba(237, 237, 237, 1);
    position: relative;
    background: #fff;
    .upload-icon {
      font-size: 38px;
      color: @primary-color;
    }
    .upload-item-text {
      .strong {
        font-weight: 400;
        color: @font-sub-color;
        font-size: 16px;
        max-width: 12em;
      }
      span {
        font-size: 12px;
        color: @font-tip-color;
      }
    }
  }

  .tips {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    border-radius: 8px;
    padding: 15px 20px;
    background: rgba(247, 247, 247, 1);
  }

  // Skeleton styles
  .talent-detail-skeleton__header {
    :deep(.talent-detail-skeleton__name .ant-skeleton-input) {
      width: 200px;
      height: 32px;
    }
    :deep(.talent-detail-skeleton__info-item .ant-skeleton-input) {
      width: 60px;
      min-width: auto;
      height: 20px;
    }
    :deep(.talent-detail-skeleton__time .ant-skeleton-input) {
      width: 100px;
      height: 16px;
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__button .ant-skeleton-button) {
      width: 100px;
      height: 32px;
    }
  }

  .talent-detail-skeleton__contact {
    :deep(.ant-skeleton-input) {
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__contact-title-1 .ant-skeleton-input) {
      width: 120px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__contact-title-2 .ant-skeleton-input) {
      width: 80px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__contact-title-3 .ant-skeleton-input) {
      width: 60px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__contact-item-1 .ant-skeleton-input) {
      width: 120px;
      height: 20px;
    }
    :deep(.talent-detail-skeleton__contact-item-2 .ant-skeleton-input) {
      width: 120px;
      height: 20px;
    }
    :deep(.talent-detail-skeleton__contact-item-3 .ant-skeleton-input) {
      width: 150px;
      height: 20px;
    }
    :deep(.talent-detail-skeleton__contact-button .ant-skeleton-button) {
      width: 130px;
      height: 32px;
    }
  }

  .talent-detail-skeleton__intention {
    :deep(.ant-skeleton-input) {
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__intention-title .ant-skeleton-input) {
      width: 120px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__intention-items .ant-skeleton-input) {
      width: 140px;
      height: 20px;
    }
  }

  .talent-detail-skeleton__experience {
    :deep(.ant-skeleton-input) {
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__experience-title .ant-skeleton-input) {
      width: 120px;
      height: 16px;
    }
  }

  .talent-detail-skeleton__resume-file {
    :deep(.ant-skeleton-input) {
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__resume-file-title .ant-skeleton-input) {
      width: 120px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__file-name .ant-skeleton-input) {
      width: 200px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__file-size .ant-skeleton-input) {
      width: 80px;
      height: 12px;
    }
    :deep(.talent-detail-skeleton__download-btn .ant-skeleton-button) {
      width: 60px;
      height: 24px;
    }
  }

  .talent-detail-skeleton__tips {
    :deep(.ant-skeleton-input) {
      min-width: auto;
    }
    :deep(.talent-detail-skeleton__tip-1 .ant-skeleton-input) {
      width: 500px;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__tip-2 .ant-skeleton-input) {
      width: 100%;
      height: 16px;
    }
    :deep(.talent-detail-skeleton__tip-3 .ant-skeleton-input) {
      width: 80%;
      height: 16px;
    }
  }
</style>

<route>
{
auth: 'talent-detail',
parentId: 0,
hideInMenu: true
}
</route>
