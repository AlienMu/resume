<template>
  <div class="work-more-detail" ref="workMoreDetailRef">
    <div class="wrap">
      <template v-if="isLoading || externalLoading">
        <a-flex vertical gap="30" class="work-detail-skeleton work-detail-skeleton__content">
          <a-flex class="work-detail-skeleton__head" align="center" justify="space-between" gap="20">
            <a-flex vertical gap="12" class="left">
              <a-flex align="center">
                <a-skeleton-input class="work-detail-skeleton__title" active style="width: 260px" size="large" />
                <a-skeleton-input class="work-detail-skeleton__salary" active style="width: 140px" size="small" />
              </a-flex>
              <a-flex class="work-detail-skeleton__tags" wrap="wrap" gap="10">
                <a-skeleton-button v-for="tag in 3" :key="`tag-${tag}`" active size="small" />
              </a-flex>
            </a-flex>
            <a-flex class="right" gap="25" align="center">
              <a-skeleton-button block active style="width: 84px" />
              <a-skeleton-button block active type="primary" style="width: 96px" />
              <a-flex vertical gap="12" align="center" class="panel">
                <a-skeleton-avatar active shape="circle" size="large" />
                <a-flex gap="6" vertical align="center" style="width: 100%">
                  <a-skeleton-button block active style="width: 80px" size="small" />
                </a-flex>
                <a-skeleton-button active block />
              </a-flex>
            </a-flex>
          </a-flex>
          <div v-for="(rows, index) in detailSkeletonSections" :key="`section-${index}`" class="work-detail-skeleton__section">
            <a-skeleton-input active style="width: 180px" size="small" />
            <a-skeleton :rows="rows" active />
          </div>
          <div class="work-detail-skeleton__gallery">
            <div class="title">
              <a-skeleton-input active style="width: 180px" size="small" />
            </div>
            <a-flex gap="10" wrap="wrap">
              <a-skeleton-input v-for="item in 4" :key="`gallery-${item}`" active style="width: 176px; height: 120px" />
            </a-flex>
          </div>
        </a-flex>
      </template>
      <a-flex v-else vertical gap="30">
        <a-flex class="detail-head" align="center" justify="space-between" gap="20">
          <a-flex vertical gap="10" class="left">
            <a-flex align="center" gap="16">
              <span class="job-name" :title="detailInfo.jobTitle">{{ detailInfo.jobTitle }}</span>
              <span class="salary-range">
                {{ detailInfo.salaryRangeShow }}
              </span>
            </a-flex>
            <a-flex class="work-more-tags" wrap="wrap" gap="10">
              <div class="work-more-tags-item">
                {{ detailInfo.jobNatureShow }}
              </div>
              <div class="work-more-tags-item">
                {{ detailInfo.recruitmentNumberShow }}
              </div>
              <div class="work-more-tags-item">
                {{ detailInfo.educationRequiredShow }}
              </div>
              <div class="work-more-tags-item" v-for="item in detailInfo.languageRequirementsShow" :key="item">
                {{ item }}
              </div>
              <div class="work-more-tags-item">
                {{ detailInfo.workExperienceShow }}
              </div>
              <div class="work-more-tags-item">
                {{ detailInfo.workLocationShow }}
              </div>
            </a-flex>
          </a-flex>
          <a-flex class="right" gap="25" align="center">
            <a-button
              type="text"
              style="color: rgba(177, 179, 189, 1); padding: 12px; line-height: 12px"
              size="large"
              :disabled="isCompanyUser"
              @click="handleReport"
            >
              <a-flex align="center" style="font-size: 14px" gap="4">
                <svg-icon name="notice" />
                {{ $t('workMore.detail.report') }}
              </a-flex>
            </a-button>
            <a-button type="primary" size="large" :loading="applyLoading" :disabled="isApplied || isCompanyUser" @click="handleApplyJob">
              {{ isApplied ? getLabel('applied') : applyLoading ? getLabel('applyLoading') : getLabel('apply') }}
            </a-button>
            <a-flex vertical gap="6" align="center" class="panel">
              <div class="avatar">
                <a-image width="40px" height="40px" :preview="false" :src="detailInfo.hrAvatar" />
              </div>
              <a-flex gap="5" class="hr-info">
                <strong>{{ detailInfo.hrName || '--' }}</strong>
                <span>{{ $t('workMore.detail.hrName') }}</span>
              </a-flex>
              <a-button block class="contact" :loading="contactLoading" :disabled="isCompanyUser" @click="handleContactHR">
                {{ $t('workMore.detail.hrContact') }}
              </a-button>
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex class="detail-step" vertical gap="12">
          <div class="title">{{ $t('workMore.detail.step.0') }}</div>
          <div class="custom-edit" v-html="detailInfo.description"></div>
        </a-flex>
        <div class="tips">
          <a-typography>
            <div>
              <a-typography-text>{{ $t('workMore.detail.tipsTitle') }}</a-typography-text>
            </div>
            <a-typography-text style="color: rgba(141, 143, 153, 1)">
              {{ $t('workMore.detail.tips.0') }}
              <br />
              {{ $t('workMore.detail.tips.1') }}
              <br />
              {{ $t('workMore.detail.tips.2') }}
              <br />
              {{ $t('workMore.detail.tips.3') }}
            </a-typography-text>
          </a-typography>
        </div>
        <a-flex class="detail-step" gap="16" vertical>
          <div class="title">{{ $t('workMore.detail.step.1') }}</div>
          <a-flex gap="20" class="detail-step-desc" align="center">
            <div class="company-logo">
              <a-image :preview="false" width="88px" height="83px" :src="detailInfo.companyLogo" />
            </div>
            <a-flex vertical gap="16">
              <a-flex gap="86">
                <a-flex gap="5" vertical>
                  <span class="text">
                    {{ $t('workMore.detail.company.name') }}：
                    <strong>{{ detailInfo.companyName }}</strong>
                  </span>
                  <span class="text">
                    <span class="text-justify">{{ $t('workMore.detail.company.website') }} </span>
                    ：
                    <a
                      :href="detailInfo.website?.startsWith('http') ? detailInfo.website : `https://${detailInfo.website}`"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ detailInfo.website }}
                    </a>
                  </span>
                </a-flex>
                <a-flex vertical gap="8">
                  <span class="text">{{ $t('workMore.detail.company.industry') }}：{{ detailInfo.industryShow || '-' }}</span>
                  <span class="text">{{ $t('workMore.detail.company.size') }}：{{ detailInfo.companySizeShow || '-' }}</span>
                </a-flex>
              </a-flex>
              <a-flex class="work-more-tags" wrap="wrap" gap="10">
                <div class="work-more-tags-item" v-for="item in detailInfo.companyBenefitsShow" :key="item">
                  {{ item }}
                </div>
              </a-flex>
            </a-flex>
          </a-flex>
        </a-flex>
        <a-flex class="detail-step" gap="12" vertical>
          <div class="title">{{ $t('workMore.detail.step.2') }}</div>
          <div class="detail-description">
            <div class="custom-edit" v-html="detailInfo.introduction"></div>
          </div>
        </a-flex>
        <a-flex class="detail-step" gap="12" vertical v-if="detailInfo.companyImages?.length > 0">
          <div class="title">{{ $t('workMore.detail.step.4') }}</div>
          <div class="detail-images-scroll">
            <a-flex class="detail-images" gap="10">
              <a-image-preview-group>
                <div class="detail-images-item" v-for="item in detailInfo.companyImages" :key="item">
                  <a-image :src="item" width="176px" height="120px" />
                </div>
              </a-image-preview-group>
            </a-flex>
          </div>
        </a-flex>
        <a-flex class="detail-step" gap="12" vertical v-if="detailInfo.welfareImages?.length > 0">
          <div class="title">{{ $t('workMore.detail.step.3') }}</div>
          <div class="detail-images-scroll">
            <a-flex class="detail-images" gap="10">
              <a-image-preview-group>
                <div class="detail-images-item" v-for="item in detailInfo.welfareImages" :key="item">
                  <a-image :src="item" width="176px" height="120px" />
                </div>
              </a-image-preview-group>
            </a-flex>
          </div>
        </a-flex>
      </a-flex>
    </div>
  </div>
  <report-resume ref="reportModalRef" context="job" />
  <resume-selector-modal ref="resumeSelectorRef" @applied="onResumeModalApplied" @cancel="onResumeModalCancel" />
</template>

<script setup>
  import { computed, ref, watch, nextTick, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { getJobDetail, negotiateJob } from '/@/api/job';
  import { applyJob } from '/@/api/application';
  import { getMyResumeList } from '/@/api/resume';
  import { getDictionary } from '/@/api/base';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { useUserStore } from '/@/store/modules/system/user';
  import { USER_TYPE_ENUM } from '/@/constants/api-const';
  import { getModal } from '/@/utils/element-util';
  import ReportResume from '/@/views/talent/components/report-resume.vue';
  import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

  const createDefaultDetail = () => ({
    jobTitle: '',
    salaryMin: '',
    salaryMax: '',
    salaryMonth: '',
    jobCategory: '',
    industry: '',
    recruitCount: 0,
    educationRequired: '',
    requirements: '',
    description: '',
    benefits: [],
    companyLogo: '',
    companyName: '',
    website: '',
    companySize: '',
    companyImages: [],
    welfareImages: [],
    hrInfo: {
      avatar: '',
      name: '',
      type: '',
    },
    isApplied: false,
    managerOtherAccount: undefined,
    managerOtherAccountValue: '',
  });

  const detailInfo = ref(createDefaultDetail());
  const isLoading = ref(true);
  const applyLoading = ref(false);
  const contactLoading = ref(false);
  const reportModalRef = ref();
  const workMoreDetailRef = ref();
  const detailSkeletonSections = [4, 4, 3, 3];
  const resumeOptions = ref([]);
  const selectedResumeId = ref(null);
  const scrollContainerWidth = ref('100%');
  const accountTypeDictionary = ref([]);
  let requestToken = 0;

  const router = useRouter();
  const userStore = useUserStore();
  const { getLabel } = useI18nText({ local: 'workMore.detail' });

  const isApplied = computed(() => detailInfo.value.isApplied);
  const isLoggedIn = computed(() => !!userStore.getToken);
  const isCompanyUser = computed(() => userStore.userType === USER_TYPE_ENUM.COMPANY.value);

  const props = defineProps({
    currentId: Number,
    listLoading: {
      type: Boolean,
      default: false,
    },
    externalLoading: {
      type: Boolean,
      default: false,
    },
  });

  const showLoginModal = (content = null) => {
    getModal('confirm', {
      title: getLabel('loginModal.title'),
      content: content || getLabel('loginModal.content'),
      okText: getLabel('loginModal.okText'),
      onOk: () => {
        window.location.href = '/login';
      },
    });
  };

  const normalizeResumeOptions = (records) => {
    if (!Array.isArray(records)) return [];
    return records
      .map((item) => ({
        id: item.id ?? item.resumeId ?? item.resumeID,
        title: item.resumeName || item.name || getLabel('resumeModal.unnamed'),
        desc: item.jobTitle || item.jobName || '',
        updatedAt: item.updatedAt || item.updated_at || item.updateTime || '',
      }))
      .filter((option) => option.id);
  };

  const fetchResumeOptions = async () => {
    try {
      const result = await getMyResumeList({ current: 1, size: 20 });
      const records = result?.records ?? result?.list ?? [];
      resumeOptions.value = normalizeResumeOptions(records);
    } catch (error) {
      console.error('[work-detail] fetch resume list failed', error);
      message.error(error?.message || getLabel('resumeModal.fetchFailed'));
      throw error;
    }
  };

  // resume selector UI moved to `resume-selector-modal.vue`

  // new component ref for modal-based resume selection
  import ResumeSelectorModal from '/@/views/work/components/resume-selector-modal.vue';
  const resumeSelectorRef = ref();

  const onResumeModalApplied = (resumeId) => {
    // modal already completed the request; update local applied state
    detailInfo.value.isApplied = true;
    selectedResumeId.value = null;
  };

  const onResumeModalCancel = () => {
    selectedResumeId.value = null;
  };

  const handleApplyJob = async () => {
    if (isCompanyUser.value) {
      return;
    }
    if (!isLoggedIn.value) {
      showLoginModal();
      return;
    }

    if (isApplied.value || applyLoading.value) {
      return;
    }

    try {
      await fetchResumeOptions();
    } catch {
      return;
    }

    if (!resumeOptions.value.length) {
      message.warning(getLabel('resumeModal.emptyTip'));
      return;
    }
    // open new modal component (pass current job id so modal can call API)
    resumeSelectorRef.value?.open?.({
      resumeOptions: resumeOptions.value,
      initialSelectedId: resumeOptions.value[0]?.id,
      jobId: props.currentId,
    });
  };

  const handleContactHR = async () => {
    if (isCompanyUser.value) {
      return;
    }
    if (!isLoggedIn.value) {
      showLoginModal();
      return;
    }

    if (contactLoading.value) {
      return;
    }

    // 检查是否已投递，如果未投递则先要求用户投递
    if (!isApplied.value) {
      try {
        await fetchResumeOptions();
      } catch {
        return;
      }

      if (!resumeOptions.value.length) {
        message.warning(getLabel('resumeModal.emptyTip'));
        return;
      }

      // 弹出投递弹窗，让用户选择简历并投递
      resumeSelectorRef.value?.open?.({
        resumeOptions: resumeOptions.value,
        initialSelectedId: resumeOptions.value[0]?.id,
        jobId: props.currentId,
        // 投递成功后自动调用联系HR
        onApplied: () => {
          // 投递成功后调用联系HR逻辑
          performContactHR();
        },
      });
      return;
    }

    // 已投递，直接联系HR
    await performContactHR();
  };

  const performContactHR = async () => {
    contactLoading.value = true;
    try {
      // 不传 resumeId 则使用最近更新的简历
      const data = await negotiateJob(Number(props.currentId), {});
      // 如果返回了投递ID，更新投递状态
      if (data.applicationId) {
        detailInfo.value.isApplied = true;
      }
      // 如果可以联系，处理联系方式
      if (data.canContact) {
        // 优先使用 Telegram
        if (data.telegramUrl) {
          window.open(data.telegramUrl, '_blank');
        } else if (data.managerOtherAccounts && Array.isArray(data.managerOtherAccounts) && data.managerOtherAccounts.length > 0) {
          // 如果没有 Telegram，解析并显示其他账号
          const firstAccount = data.managerOtherAccounts[0];
          if (typeof firstAccount === 'string') {
            const lastColonIndex = firstAccount.lastIndexOf(':');
            if (lastColonIndex > 0) {
              const accountType = firstAccount.substring(0, lastColonIndex); // "more_accounts:wechat"
              const accountValue = firstAccount.substring(lastColonIndex + 1); // "123131"
              showOtherAccountModal(accountType, accountValue);
            }
          }
        }
      }
    } finally {
      contactLoading.value = false;
    }
  };

  const showOtherAccountModal = (accountType, accountValue) => {
    // 从字典中查找账号类型的显示名称
    // accountType 格式: "more_accounts:wechat"
    let accountTypeName = accountType;
    if (accountTypeDictionary.value.length > 0) {
      const dictItem = accountTypeDictionary.value.find((item) => {
        const itemKey = `${item.typeCode}:${item.itemValue}`;
        return itemKey === accountType;
      });
      if (dictItem) {
        accountTypeName = dictItem.itemName;
      }
    }

    getModal('info', {
      title: getLabel('contactModal.title'),
      content: `${accountTypeName}: ${accountValue}`,
      okText: getLabel('contactModal.okText'),
      centered: true,
    });
  };

  const loadAccountTypeDictionary = async () => {
    try {
      accountTypeDictionary.value = await getDictionary({ typeCode: 'more_accounts' });
    } catch (error) {
      console.error('[work-detail] load account type dictionary failed', error);
    }
  };

  const handleReport = () => {
    if (isCompanyUser.value) {
      return;
    }
    if (!isLoggedIn.value) {
      showLoginModal(getLabel('loginModal.reportContent'));
      return;
    }

    reportModalRef.value?.open?.({
      targetId: Number(props.currentId),
      context: 'job',
    });
  };

  const convertQuillDeltaToHtml = (value) => {
    if (value == null || value === '') return '';

    // Already-rendered HTML/text
    if (typeof value === 'string') {
      const text = value.trim();
      if (!text) return '';
      // If it looks like a Delta JSON string, parse it; otherwise treat as HTML/text.
      if (!(text.startsWith('{') || text.startsWith('['))) return value;
      try {
        const parsed = JSON.parse(text);
        const ops = Array.isArray(parsed?.ops) ? parsed.ops : Array.isArray(parsed) ? parsed : null;
        if (!ops) return value;
        return new QuillDeltaToHtmlConverter(ops, { inlineStyles: true, multiLineParagraph: false }).convert();
      } catch {
        return value;
      }
    }

    // Delta object (common backend return)
    if (typeof value === 'object') {
      const ops = Array.isArray(value?.ops) ? value.ops : null;
      if (!ops) return '';
      return new QuillDeltaToHtmlConverter(ops, { inlineStyles: true, multiLineParagraph: false }).convert();
    }

    return '';
  };

  const normalizeJobDetail = (detail) => {
    const source = detail || {};
    const normalized = {
      ...createDefaultDetail(),
      ...source,
    };

    // Rich text fields: support backend Delta object or JSON string or plain HTML/text.
    normalized.description = convertQuillDeltaToHtml(source.description);
    normalized.introduction = convertQuillDeltaToHtml(source.introduction);

    // 解析 managerOtherAccounts 数组
    // 格式: ["more_accounts:wechat:123131"]
    if (Array.isArray(source.managerOtherAccounts) && source.managerOtherAccounts.length > 0) {
      const firstAccount = source.managerOtherAccounts[0];
      if (typeof firstAccount === 'string') {
        // 找到最后一个冒号的位置，前面是账号类型，后面是账号值
        const lastColonIndex = firstAccount.lastIndexOf(':');
        if (lastColonIndex > 0) {
          normalized.managerOtherAccount = firstAccount.substring(0, lastColonIndex); // "more_accounts:wechat"
          normalized.managerOtherAccountValue = firstAccount.substring(lastColonIndex + 1); // "123131"
        }
      }
    }

    return normalized;
  };

  const getDetailInfo = async (id) => {
    if (!id) {
      detailInfo.value = createDefaultDetail();
      return;
    }
    requestToken += 1;
    const currentToken = requestToken;
    isLoading.value = true;
    try {
      const result = await getJobDetail(id);
      if (currentToken !== requestToken) return;
      detailInfo.value = normalizeJobDetail(result);
    } catch (error) {
      console.error('[work-list] fetch job detail failed', error);
    } finally {
      if (currentToken === requestToken) {
        isLoading.value = false;
      }
    }
  };

  watch(
    () => props.currentId,
    (id) => {
      getDetailInfo(id);
    },
    { immediate: true }
  );

  onMounted(() => {
    loadAccountTypeDictionary();
  });
</script>

<style scoped lang="less">
  .work-more-detail {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    width: 964px;
    overflow-x: hidden;
    & > .wrap {
      padding: 4px 24px 16px;
      box-sizing: border-box;
    }
    .work-detail-skeleton {
      width: 100%;
    }
    .work-detail-skeleton__content {
      height: 100%;
    }
    .work-detail-skeleton__head {
      .panel {
        width: 164px;
        border-radius: 8px;
        padding: 8px;
        background: linear-gradient(180deg, rgba(214, 231, 255, 1) 0%, rgba(240, 244, 247, 1) 100%);
      }
    }
    .work-detail-skeleton__section,
    .work-detail-skeleton__gallery {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .detail-head {
      border-bottom: 1px solid @border-color;
      padding-bottom: 16px;
      .left {
        flex: 1;
        max-width: 450px;
      }
      .right {
        flex-shrink: 0;
      }
      .job-name {
        color: @font-primary-color;
        font-size: 24px;
        word-break: break-word;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .salary-range {
        color: @error-color;
        font-size: 18px;
        word-break: break-word;
        flex-shrink: 0;
      }
      .panel {
        border-radius: 8px;
        width: 164px;
        padding: 4px;
        background: linear-gradient(180deg, rgba(214, 231, 255, 1) 0%, rgba(240, 244, 247, 1) 100%);
        .avatar {
          border-radius: 50%;
          overflow: hidden;
          display: inline-block;
        }
        .hr-info {
          font-size: 12px;

          span {
            color: @font-desc-color;
          }
        }
        .contact:not(:disabled) {
          color: @primary-color;
          height: 32px;
          border: none;
        }
      }
    }
    .detail-step {
      overflow: hidden;
      flex: 1;
      .title {
        font-size: 16px;
        font-weight: 700;
        color: @font-primary-color;
      }
      .detail-description {
        color: @font-sub-color;
        line-height: 24px;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .detail-step-desc {
        color: @font-sub-color;
        .company-logo {
          padding: 20px;
          border-radius: 8px;
          background: rgba(247, 247, 247, 1);
        }
      }
      .detail-images-scroll {
        overflow: hidden;

        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

        &::-webkit-scrollbar {
          height: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }

      .detail-images {
        .detail-images-item {
          background: rgba(247, 247, 247, 1);
          border-radius: 8px;
          flex-shrink: 0;
        }
      }
    }
    .tips {
      padding: 10px 20px;
      background: rgba(247, 247, 247, 1);
      border-radius: 8px;
    }
    .text-justify {
      text-align: justify;
      text-align-last: justify;
      width: 4em;
      display: inline-block;
    }

    .work-more-tags {
      .work-more-tags-item {
        padding: 4px 10px;
        background: @border-color;
        border-radius: 4px;
      }
    }
  }
</style>
