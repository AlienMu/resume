<template>
  <a-flex vertical class="information">
    <content-head :tips="$t('enterpriseCenter.titleTips', { companyFreezeDays: userStore.siteConfig.otherItems.companyFreezeDays })">
      <a-button
        :disabled="!isChange || companyStore.loading || companyStore.updating"
        :loading="companyStore.updating"
        type="primary"
        @click="handleUpdate"
      >
        {{ getLabel('update') }}
      </a-button>
    </content-head>
    <a-spin :spinning="companyStore.loading">
      <a-form ref="formRef" :model="form" :rules="formRules">
        <a-flex gap="30" vertical>
          <a-flex vertical class="form-group" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.0') }}</span>
            </a-flex>
            <a-flex gap="20" align="center" style="width: 100%">
              <a-flex class="avatar-edit" gap="24">
                <a-image
                  @click="avatarFileRef.click()"
                  v-if="form.managerAvatar"
                  style="border-radius: 4px; cursor: pointer"
                  :src="form.managerAvatar"
                  :preview="false"
                  width="112px"
                  height="112px"
                />
                <div class="add-avatar" @click="avatarFileRef.click()" v-else style="cursor: pointer">
                  <svg-icon name="plus" />
                </div>
                <a-flex vertical gap="10" justify="center" align="flex-start">
                  <span style="padding: 0" type="link" size="small" class="mui-primary-text">{{ getLabel('form.uploadAvatar') }}</span>
                  <span class="mui-small-size mui-desc-text">{{ getLabel('uploadPlaceholder') }}</span>
                  <input ref="avatarFileRef" type="file" accept="image/*" @change="handleUpload($event, 'managerAvatar')" class="upload-input" />
                </a-flex>
              </a-flex>
              <a-flex vertical class="flex-max">
                <a-flex gap="10" class="flex-max">
                  <div class="flex-max">
                    <m-form-item
                      name="managerNickname"
                      required
                      :no-style="false"
                      :label="getLabel('form.englishName')"
                      :rules="formRules.managerNickname"
                    >
                      <a-input :maxlength="12" v-model:value.trim="form.managerNickname" :placeholder="getPlaceholder('form.englishName')" />
                    </m-form-item>
                  </div>
                  <div class="flex-max">
                    <m-form-item
                      name="managerOccupation"
                      required
                      :no-style="false"
                      :label="getLabel('form.job')"
                      :rules="formRules.managerOccupation"
                    >
                      <dictionary-select
                        cascader
                        type="job_category"
                        :placeholder="getPlaceholder('form.job', true)"
                        v-model:value="form.managerOccupation"
                      />
                    </m-form-item>
                  </div>
                </a-flex>
                <a-flex gap="10">
                  <div class="flex-max">
                    <m-form-item
                      name="managerTelegramAccount"
                      :no-style="false"
                      :label="getLabel('form.telegram')"
                      :rules="formRules.managerTelegramAccount"
                    >
                      <a-input :maxlength="25" v-model:value.trim="form.managerTelegramAccount" :placeholder="getLabel('form.telegramPlaceholder')" />
                    </m-form-item>
                  </div>
                  <div class="flex-max">
                    <m-form-item name="managerEmail" required :no-style="false" :label="getLabel('form.email')" :rules="formRules.managerEmail">
                      <a-input :maxlength="100" v-model:value.trim="form.managerEmail" :placeholder="getLabel('form.emailPlaceholder')" />
                    </m-form-item>
                  </div>
                </a-flex>
                <a-flex gap="10" style="margin-bottom: -10px">
                  <div class="flex-max">
                    <m-form-item
                      name="managerOtherAccountValue"
                      :no-style="false"
                      :label="getLabel('form.moreAccount')"
                      :rules="formRules.managerOtherAccountValue"
                    >
                      <template #label>
                        <dictionary-select
                          type="more_accounts"
                          :border="false"
                          v-model:value="form.managerOtherAccount"
                          :placeholder="getLabel('form.moreAccount')"
                        />
                      </template>
                      <a-input
                        :maxlength="25"
                        :placeholder="getLabel('form.moreAccountPlaceholder')"
                        v-model:value.trim="form.managerOtherAccountValue"
                      />
                    </m-form-item>
                  </div>
                  <div class="flex-max"></div>
                </a-flex>
              </a-flex>
            </a-flex>
          </a-flex>
          <a-flex vertical class="form-group" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.1') }}</span>
            </a-flex>
            <a-flex gap="20" align="center" style="width: 100%">
              <a-flex class="avatar-edit" gap="24">
                <a-image
                  v-if="form.companyLogo"
                  style="border-radius: 4px; cursor: pointer"
                  :src="form.companyLogo"
                  :preview="false"
                  @click="logoFileRef.click()"
                  width="112px"
                  height="112px"
                />
                <div class="add-avatar" v-else @click="logoFileRef.click()" style="cursor: pointer">
                  <svg-icon name="plus" />
                </div>
                <a-flex vertical gap="10" justify="center" align="flex-start">
                  <span style="padding: 0" type="link" size="small" class="mui-primary-text">{{ getLabel('form.uploadEnterpriseLogo') }}</span>
                  <span class="mui-small-size mui-desc-text">{{ getLabel('uploadPlaceholder') }}</span>
                  <input ref="logoFileRef" type="file" accept="image/*" @change="handleUpload($event, 'companyLogo')" class="upload-input" />
                </a-flex>
              </a-flex>
              <a-flex vertical class="flex-max">
                <a-flex gap="10" class="flex-max">
                  <div class="flex-max">
                    <m-form-item
                      name="companyName"
                      required
                      :no-style="false"
                      :label="getLabel('form.enterpriseName')"
                      :rules="formRules.companyName"
                    >
                      <a-input :maxlength="35" v-model:value.trim="form.companyName" :placeholder="getPlaceholder('form.enterpriseName')" />
                    </m-form-item>
                  </div>
                  <div class="flex-max">
                    <m-form-item name="industry" required :no-style="false" :label="getLabel('form.industry')" :rules="formRules.industry">
                      <dictionary-select type="industry_sector" v-model:value="form.industry" :placeholder="getPlaceholder('form.industry', true)" />
                    </m-form-item>
                  </div>
                </a-flex>
                <a-flex gap="10" style="margin-bottom: -10px">
                  <div class="flex-max">
                    <m-form-item
                      name="companyWebsite"
                      :no-style="false"
                      :label="getLabel('form.enterpriseWebsite')"
                      :rules="formRules.companyWebsite"
                    >
                      <a-input :maxlength="100" v-model:value.trim="form.companyWebsite" :placeholder="getPlaceholder('form.enterpriseWebsite')" />
                    </m-form-item>
                  </div>
                  <div class="flex-max">
                    <m-form-item
                      name="companySize"
                      required
                      :no-style="false"
                      :label="getLabel('form.enterpriseScale')"
                      :rules="formRules.companySize"
                    >
                      <dictionary-select
                        type="company_size"
                        v-model:value="form.companySize"
                        :placeholder="getPlaceholder('form.enterpriseScale', true)"
                      />
                    </m-form-item>
                  </div>
                </a-flex>
              </a-flex>
            </a-flex>
          </a-flex>

          <a-flex vertical class="form-group" gap="16" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.2') }}</span>
            </a-flex>
            <a-form-item name="companyBenefits" :rules="formRules.companyBenefits">
              <a-checkbox-group v-model:value="form.companyBenefits">
                <a-flex align="flex-start" gap="20" wrap="wrap">
                  <a-checkbox v-for="item in benefitOptions" :key="item.itemValue" :value="item.itemValue">
                    {{ item.itemName }}
                  </a-checkbox>
                </a-flex>
              </a-checkbox-group>
            </a-form-item>
          </a-flex>
          <a-flex vertical class="form-group" gap="16" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.3') }}</span>
            </a-flex>
            <div style="width: 100%">
              <a-form-item name="companyIntroduction" :rules="formRules.companyIntroduction">
                <rich-edit
                  :placeholder="getLabel('textareaPlaceholder')"
                  :min-length="30"
                  :max-length="1000"
                  v-model:value="form.companyIntroduction"
                />
              </a-form-item>
            </div>
          </a-flex>
          <a-flex vertical class="form-group" gap="16" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.5') }}</span>
            </a-flex>
            <a-form-item name="companyShowcaseImages">
              <m-upload-card v-model:files="form.companyShowcaseImages" :maxUploadSize="5" />
            </a-form-item>
          </a-flex>
          <a-flex vertical class="form-group" gap="16" align="flex-start">
            <a-flex class="form-group-title">
              <span>{{ getLabel('formTitle.4') }}</span>
            </a-flex>
            <a-form-item name="welfareImages">
              <m-upload-card v-model:files="form.welfareImages" :maxUploadSize="5" />
            </a-form-item>
          </a-flex>
        </a-flex>
      </a-form>
    </a-spin>
  </a-flex>

  <image-cropper ref="cropperRef" @cropped="handleCropComplete" />
</template>

<script setup>
  import ContentHead from '../components/content-head.vue';
  import { nextTick, onMounted, ref, watch, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import ImageCropper from '/@/components/support/image-cropper/image-cropper.vue';
  import { message } from 'ant-design-vue';
  import { dataUrlToFile, validateImageFile } from '/@/utils/file-util';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { cloneDeep, isEqual } from 'lodash';
  import MUploadCard from '/@/components/mui/m-upload-card/m-upload-card.vue';
  import { getCompanyInfo, saveOrUpdateCompanyInfo } from '/@/api/company';
  import RichEdit from '/@/components/framework/rich-edit/rich-edit.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import { getDictionary } from '/@/api/base';
  import { uploadFile } from '/@/api/upload';
  import { useUserStore } from '/@/store/modules/system/user';
  import { useCompanyStore } from '/@/store/modules/company';
  import { Delta } from '@vueup/vue-quill';

  const { getLabel, getPlaceholder, getCommon } = useI18nText({ local: 'enterpriseCenter.information' });
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const router = useRouter();

  const getRequiredMessage = (name) => `Please enter ${getLabel(name)}`;
  const TELEGRAM_PATTERN = /^@[A-Za-z0-9_]{3,}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[^\s]*)?$/;

  const validateTelegram = async (_, value) => {
    // Check that at least one of Telegram or the other account is filled in
    const hasOtherAccount = form.value.managerOtherAccount && form.value.managerOtherAccountValue;
    if (!value && !hasOtherAccount) {
      throw new Error(getLabel('validation.telegramOrOtherRequired'));
    }
    if (value && !TELEGRAM_PATTERN.test(value)) {
      throw new Error(getLabel('validation.telegramFormat'));
    }
    return Promise.resolve();
  };

  const validateEmail = async (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    if (!EMAIL_PATTERN.test(value)) {
      throw new Error(getLabel('validation.emailFormat'));
    }
  };

  const validateOtherAccount = async (_, value) => {
    // Check that at least one of Telegram or the other account is filled in
    const hasTelegram = form.value.managerTelegramAccount;
    if (!hasTelegram && form.value.managerOtherAccount && !value) {
      throw new Error(getLabel('form.moreAccountPlaceholder'));
    }
    if (!hasTelegram && !form.value.managerOtherAccount && !value) {
      throw new Error(getLabel('validation.telegramOrOtherRequired'));
    }
    return Promise.resolve();
  };

  const validateWebsite = async (_, value) => {
    if (!value) return;
    if (!WEBSITE_PATTERN.test(value)) {
      throw new Error(getLabel('validation.website'));
    }
  };

  const validateCompanyIntro = async (_, value) => {
    if (!value) {
      throw new Error(getLabel('validation.companyIntro'));
    }

    // For the Quill editor, we need to extract plain text from the Delta object
    if (value && value.ops) {
      let plainText = '';
      value.ops.forEach((op) => {
        if (typeof op.insert === 'string') {
          plainText += op.insert;
        }
      });
      plainText = plainText.replace(/\n/g, '').trim();

      if (plainText.length < 30) {
        throw new Error(getLabel('validation.companyIntro'));
      }
    }

    return Promise.resolve();
  };

  const formRules = {
    managerNickname: [{ required: true, message: getRequiredMessage('form.englishName') }],
    managerOccupation: [{ required: true, message: getRequiredMessage('form.job') }],
    managerTelegramAccount: [{ validator: validateTelegram, trigger: 'blur' }],
    managerEmail: [{ validator: validateEmail, trigger: 'blur' }],
    managerOtherAccountValue: [{ validator: validateOtherAccount, trigger: 'blur' }],
    companyName: [{ required: true, message: getRequiredMessage('form.enterpriseName') }],
    industry: [{ required: true, message: getRequiredMessage('form.industry') }],
    companyWebsite: [{ validator: validateWebsite, trigger: 'blur' }],
    companySize: [{ required: true, message: getRequiredMessage('form.enterpriseScale') }],
    companyBenefits: [
      {
        type: 'array',
        required: true,
        message: getLabel('validation.companyBenefits'),
        trigger: 'change',
      },
    ],
    companyIntroduction: [{ validator: validateCompanyIntro, trigger: 'blur' }],
  };

  const benefitOptions = ref([]);

  const loadBenefitOptions = async () => {
    benefitOptions.value = await getDictionary({ typeCode: 'company_benefits' });
    benefitOptions.value = benefitOptions.value.map((item) => ({
      ...item,
      itemValue: item.typeCode + ':' + item.itemValue,
    }));
  };

  const createDefaultForm = () => ({
    managerAvatar: '',
    managerNickname: '',
    managerOccupation: undefined,
    managerTelegramAccount: '',
    managerEmail: '',
    managerOtherAccount: undefined,
    managerOtherAccountValue: '',
    companyLogo: '',
    companyName: '',
    industry: undefined,
    companyWebsite: '',
    companySize: undefined,
    companyBenefits: [],
    companyIntroduction: '',
    welfareImages: [],
    companyShowcaseImages: [],
  });

  // Local form state, used to handle user input
  const localForm = ref(createDefaultForm());

  const form = computed({
    get: () => localForm.value,
    set: (value) => {
      localForm.value = value;
    },
  });

  const isChange = ref(false);

  const formRef = ref();

  const companyId = ref();
  const originalForm = ref(createDefaultForm());
  let isInitializing = false;
  let hasInitWatch = false;

  const normalizeImageList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter(Boolean).map((url, index) => {
      const suffix = (() => {
        try {
          const urlObj = new URL(url, window.location.origin);
          const pathname = urlObj.pathname;
          const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
          return ext || 'jpg';
        } catch (error) {
          const dotIndex = url.lastIndexOf('.');
          if (dotIndex > -1) {
            return url.substring(dotIndex + 1);
          }
          return 'jpg';
        }
      })();
      return {
        uid: `${Date.now()}-${index}`,
        name: `image-${index}`,
        url,
        status: 'done',
        fileType: suffix.toLowerCase(),
      };
    });
  };

  const normalizeDetail = (data) => {
    if (!data || typeof data !== 'object') return createDefaultForm();

    // Parse the managerOtherAccounts array
    // Format: ["more_accounts:wechat:123131"]
    // The value returned by dictionary-select is the full dictionary key (e.g. "more_accounts:wechat")
    let otherAccount = undefined;
    let otherAccountValue = '';
    if (Array.isArray(data.managerOtherAccounts) && data.managerOtherAccounts.length > 0) {
      const firstAccount = data.managerOtherAccounts[0];
      if (typeof firstAccount === 'string') {
        // Find the last colon: the part before it is the account type, the part after is the account value
        const lastColonIndex = firstAccount.lastIndexOf(':');
        if (lastColonIndex > 0) {
          otherAccount = firstAccount.substring(0, lastColonIndex); // "more_accounts:wechat"
          otherAccountValue = firstAccount.substring(lastColonIndex + 1); // "123131"
        }
      }
    }

    return {
      managerAvatar: data.managerAvatar || '',
      managerNickname: data.managerEnglishName || '',
      managerOccupation: data.managerOccupation || undefined,
      managerTelegramAccount: data.managerTelegramAccount || '',
      managerEmail: data.managerEmail || '',
      managerOtherAccount: otherAccount,
      managerOtherAccountValue: otherAccountValue,
      companyLogo: data.companyLogo || '',
      companyName: data.companyName || '',
      industry: data.industry || undefined,
      companyWebsite: data.companyWebsite || '',
      companySize: data.companySize || undefined,
      companyBenefits: Array.isArray(data.companyBenefits) ? data.companyBenefits : [],
      companyIntroduction: new Delta(data.companyIntroduction) || '',
      welfareImages: normalizeImageList(data.welfareImages),
      companyShowcaseImages: normalizeImageList(data.companyShowcaseImages),
    };
  };

  const toImageUrls = (files) => {
    if (!Array.isArray(files)) return [];
    return files.map((item) => item?.url).filter(Boolean);
  };

  const buildPayload = (formData) => {
    const welfareImageUrls = toImageUrls(formData.welfareImages);
    const showcaseImageUrls = toImageUrls(formData.companyShowcaseImages);

    // Build the managerOtherAccounts array
    // Format: ["more_accounts:wechat:123131"]
    // managerOtherAccount is already the full dictionary key (e.g. "more_accounts:wechat")
    let managerOtherAccounts = undefined;
    if (formData.managerOtherAccount && formData.managerOtherAccountValue) {
      managerOtherAccounts = [`${formData.managerOtherAccount}:${formData.managerOtherAccountValue}`];
    }

    const payload = {
      companyName: formData.companyName?.trim() || '',
      managerAvatar: formData.managerAvatar?.trim() || undefined,
      managerEnglishName: formData.managerNickname?.trim() || undefined,
      managerOccupation: formData.managerOccupation || undefined,
      managerTelegramAccount: formData.managerTelegramAccount?.trim() || undefined,
      managerEmail: formData.managerEmail || undefined,
      managerOtherAccounts: managerOtherAccounts,
      companyLogo: formData.companyLogo?.trim() || undefined,
      industry: formData.industry || undefined,
      companyWebsite: formData.companyWebsite?.trim() || undefined,
      companySize: formData.companySize || undefined,
      companyBenefits: Array.isArray(formData.companyBenefits) && formData.companyBenefits.length > 0 ? formData.companyBenefits : undefined,
      companyIntroduction: formData.companyIntroduction || undefined,
      welfareImages: welfareImageUrls.length > 0 ? welfareImageUrls : undefined,
      companyShowcaseImages: showcaseImageUrls.length > 0 ? showcaseImageUrls : undefined,
    };

    return Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== undefined));
  };

  const setFormValue = (data) => {
    isInitializing = true;
    form.value = cloneDeep(data);
    originalForm.value = cloneDeep(data);
    isChange.value = false;
    nextTick(() => {
      isInitializing = false;
    });
  };

  const handleUpdate = async () => {
    try {
      await formRef.value?.validate?.();
      const payload = buildPayload(form.value);
      await companyStore.updateCompanyInfo(payload);
      // Update the original state for change comparison
      originalForm.value = cloneDeep(form.value);
      isChange.value = false;
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const getDetailInfo = async () => {
    // If the company info has already been loaded, use the data from the store directly
    let data = companyStore.companyInfo;

    // If it hasn't been loaded yet, call the API to fetch the data
    if (!companyStore.hasFetchedCompanyInfo) {
      data = await companyStore.fetchCompanyInfo();
    }

    if (data) {
      companyId.value = data.companyId;
      // Sync the data into the local form
      form.value = normalizeDetail(data);
      // Update the original state for change comparison
      originalForm.value = cloneDeep(normalizeDetail(data));
    } else {
      companyId.value = undefined;
      form.value = createDefaultForm();
      originalForm.value = createDefaultForm();
    }
    initWatch();
  };

  const cropperRef = ref();

  const avatarFileRef = ref();
  const logoFileRef = ref();
  const currentUploadField = ref('');

  const handleUpload = (e, field = 'companyLogo') => {
    const file = e.target.files[0];
    if (!validateImageFile(file, 2)) return;
    currentUploadField.value = field;
    const reader = new FileReader();
    reader.onload = (event) => {
      e.target.value = '';
      cropperRef.value.handleOpen(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (url) => {
    const file = dataUrlToFile(url, `avatar-${Date.now()}.png`);
    if (!file) return;
    const data = await uploadFile({ file });
    form.value[currentUploadField.value] = data.url;
    currentUploadField.value = '';
  };

  const initWatch = () => {
    if (hasInitWatch) return;
    watch(
      () => localForm.value,
      (newVal) => {
        if (isInitializing) return;
        isChange.value = !isEqual(newVal, originalForm.value);
      },
      {
        deep: true,
      }
    );
    hasInitWatch = true;
  };

  onMounted(() => {
    loadBenefitOptions();
    getDetailInfo();
  });
</script>

<style scoped lang="less">
  .information {
    padding-bottom: 30px;
  }
  .form-group {
    padding-top: 30px;
    padding-left: 40px;
    padding-right: 30px;
    border-top: 1px solid @border-color;
    gap: 10px;
    .form-group-title {
      align-items: center;
      gap: 10px;
      span {
        font-size: 16px;
        color: @font-sub-color;
      }
      b {
        font-size: 12px;
        color: @error-color;
        font-weight: normal;
        line-height: 1em;
      }
    }
  }

  .avatar-edit {
    opacity: 1;
    border-radius: 4px;
    width: 393px;
    flex-shrink: 0;
    background: rgba(247, 247, 247, 1);
    padding: 8px 13px;

    .add-avatar {
      background: @base-bg-color;
      border-radius: 4px;
      width: 111px;
      height: 111px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: @primary-color;
    }
    .upload-input {
      visibility: hidden;
      width: 0;
      height: 0;
    }
  }
  .flex-max {
    flex: 1;
  }
</style>
<route>
{
auth: 'information',
parentId: 'enterprise-center',
sort: 0
}
</route>
