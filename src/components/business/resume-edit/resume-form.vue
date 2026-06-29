<template>
  <a-form ref="formRef" :model="formComputed" :rules="formRules" style="margin-bottom: 20px">
    <a-flex vertical gap="30" style="width: 100%">
      <a-flex vertical>
        <a-row :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="name" required :label="getFormLabel('enName')">
              <a-input :maxlength="25" :placeholder="getFormPlaceholder('enName')" v-model:value.trim="formComputed.name" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="gender" required :label="getFormLabel('sex')">
              <m-select :options="genderOptions" :placeholder="getFormPlaceholder('sex', true)" v-model:value="formComputed.gender" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="age" :label="getFormLabel('age')" required>
              <a-input-number
                style="width: 100%"
                :controls="false"
                :precision="0"
                :max="100"
                :min="1"
                :placeholder="getFormPlaceholder('age')"
                v-model:value="formComputed.age"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="nationality" :label="getFormLabel('nationality')" required>
              <dictionary-select
                type="country_location"
                :placeholder="getFormPlaceholder('nationality', true)"
                v-model:value="formComputed.nationality"
              />
            </m-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="education" :label="getFormLabel('diploma')" required>
              <dictionary-select type="education" :placeholder="getFormPlaceholder('diploma')" v-model:value="formComputed.education" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="workYears" :label="getFormLabel('workExperience')" required>
              <dictionary-select type="work_experience" :placeholder="getFormPlaceholder('workExperience')" v-model:value="formComputed.workYears" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="jobStatus" :label="getFormLabel('jobStatus')" required>
              <dictionary-select
                type="job_seeker_status"
                :placeholder="getFormPlaceholder('jobStatus', true)"
                v-model:value="formComputed.jobStatus"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="currentLocation" :label="getFormLabel('location')" required>
              <dictionary-select type="expected_country" :placeholder="getFormPlaceholder('location')" v-model:value="formComputed.currentLocation" />
            </m-form-item>
          </a-col>
        </a-row>
      </a-flex>
      <a-flex vertical>
        <div class="resume-form-title">{{ $t('userCenter.content.resumeEdit.formTitle[0]') }}</div>
        <a-row :gutter="10">
          <a-col :span="9">
            <a-row :gutter="10">
              <a-col :span="16">
                <m-form-item name="phone">
                  <template #label>
                    <m-phone-prefixe-select
                      v-model:value="formComputed.phoneCountryCode"
                      :placeholder="formComputed.phoneCountryCode ? undefined : getFormLabel('phone')"
                    />
                  </template>
                  <a-input :placeholder="getFormPlaceholder('phone')" :maxlength="12" v-model:value.trim="formComputed.phone" />
                </m-form-item>
              </a-col>
              <a-col :span="8">
                <a-radio-group v-model:value="formComputed.phonePublic" style="white-space: nowrap; padding-top: 8px">
                  <m-radio style="margin-right: 4px" :value="PUBLIC_STATUS_ENUM.PUBLIC.value">{{ $t('common.hideStatus', 0) }}</m-radio>
                  <m-radio :value="PUBLIC_STATUS_ENUM.PRIVATE.value">{{ $t('common.hideStatus', 1) }}</m-radio>
                </a-radio-group>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="10">
              <a-col :span="12">
                <m-form-item name="telegram" :label="getFormLabel('telegram')">
                  <a-input :maxlength="25" :placeholder="getFormPlaceholder('telegram')" v-model:value.trim="formComputed.telegram" />
                </m-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="9">
            <a-row :gutter="10" align="middle">
              <a-col :span="16">
                <m-form-item name="email" :label="getFormLabel('email')">
                  <a-input :maxlength="100" :placeholder="getFormPlaceholder('email')" v-model:value.trim="formComputed.email" />
                </m-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="6">
            <a-row :gutter="10">
              <a-col :span="24">
                <m-form-item name="otherAccountValue" :label="getFormLabel('moreAccount')">
                  <template #label>
                    <dictionary-select
                      type="more_accounts"
                      :border="false"
                      v-model:value="formComputed.otherAccount"
                      :placeholder="getFormLabel('moreAccount')"
                    />
                  </template>
                  <a-input :maxlength="25" :placeholder="getFormPlaceholder('moreAccount')" v-model:value.trim="formComputed.otherAccountValue" />
                </m-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-flex>
      <a-flex vertical>
        <div class="resume-form-title">{{ $t('userCenter.content.resumeEdit.formTitle[1]') }}</div>
        <a-row :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="industry" required :label="getFormLabel('desiredIndustry')">
              <dictionary-select
                cascader
                type="industry_sector"
                :placeholder="getFormPlaceholder('desiredIndustry')"
                v-model:value="formComputed.industry"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="jobCategory" required :label="getFormLabel('desiredPosition')">
              <dictionary-select
                cascader
                type="job_category"
                :placeholder="getFormPlaceholder('desiredPosition')"
                v-model:value="formComputed.jobCategory"
              />
            </m-form-item>
          </a-col>

          <a-col :span="FORM_SPAN">
            <m-form-item name="currentSalary" :label="getFormLabel('currentMonthlySalary')" required>
              <dictionary-select
                type="salary_range"
                :placeholder="getFormPlaceholder('currentMonthlySalary')"
                v-model:value="formComputed.currentSalary"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="expectedSalary" :label="getFormLabel('desiredMonthlySalary')" required>
              <dictionary-select
                type="salary_range"
                :placeholder="getFormPlaceholder('desiredMonthlySalary')"
                v-model:value="formComputed.expectedSalary"
              />
            </m-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="abroadWillingness" :label="getFormLabel('goAbroadDesire')" required>
              <dictionary-select
                type="abroad_intention"
                :placeholder="getFormPlaceholder('goAbroadDesire', true)"
                v-model:value="formComputed.abroadWillingness"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="workStyle" :label="getFormLabel('workMethod')" required>
              <dictionary-select type="job_nature" :placeholder="getFormPlaceholder('workMethod', true)" v-model:value="formComputed.workStyle" />
            </m-form-item>
          </a-col>

          <a-col :span="FORM_SPAN">
            <m-form-item name="expectedCountry" :label="getFormLabel('countryDesired')" required>
              <dictionary-select
                type="expected_country"
                :placeholder="getFormPlaceholder('countryDesired')"
                v-model:value="formComputed.expectedCountry"
              />
            </m-form-item>
          </a-col>
        </a-row>
      </a-flex>
      <a-flex vertical>
        <a-flex style="width: 100%" class="resume-form-title" align="center" justify="space-between">
          <a-flex gap="10" align="center">
            <span>{{ $t('userCenter.content.resumeEdit.formTitle[2]', 0) }} <b>*</b></span>
            <i>{{ $t('userCenter.content.resumeEdit.formTitle[2]', 1) }}</i>
          </a-flex>
          <strong>{{ $t('userCenter.content.resumeEdit.formTitle[2]', 2) }}</strong>
        </a-flex>
        <a-form-item name="experienceContent">
          <rich-edit v-model:value="formComputed.experienceContent" />
        </a-form-item>
      </a-flex>
      <a-flex vertical>
        <a-flex style="width: 100%" class="resume-form-title" align="center" justify="space-between">
          <a-flex gap="10" align="center">
            <span>{{ $t('userCenter.content.resumeEdit.formTitle[3]', 1) }}</span>
            <i>{{ $t('userCenter.content.resumeEdit.formTitle[3]', 0) }}</i>
          </a-flex>
        </a-flex>
        <m-upload
          accept="docx,xlsx,jpeg,jpg,png,pdf,doc"
          :maxSize="3"
          :maxUploadSize="1"
          v-model:files="resumeFiles"
          @change="handleResumeFileChange"
          @remove="handleResumeFileRemove"
        />
      </a-flex>
    </a-flex>
  </a-form>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import i18n from '/@/i18n';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import MRadio from '/@/components/mui/m-radio/m-radio.vue';
  import { ABROAD_WILLINGNESS, JOB_TYPE_ENUM, PUBLIC_STATUS_ENUM, RESUME_STATUS_ENUM, GENDER_ENUM } from '/@/constants/api-const';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import RichEdit from '/@/components/framework/rich-edit/rich-edit.vue';
  import MUpload from '/@/components/mui/m-upload/m-upload.vue';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import { getBasicRules } from '/@/config/rule-config';
  import MPhonePrefixeSelect from '/@/components/mui/m-phone-prefixe-select/m-phone-prefixe-select.vue';

  const FORM_SPAN = 6;

  const props = defineProps({
    form: {
      type: Object,
      default: () => ({}),
    },
    context: {
      type: String,
      default: 'user',
    },
  });

  const emit = defineEmits(['update:form', 'files-change', 'change']);

  const formRef = ref();

  const formComputed = computed({
    set(value) {
      emit('update:form', value);
    },
    get() {
      return props.form;
    },
  });

  const resumeFiles = ref([]);

  const genderOptions = Object.values(GENDER_ENUM).map((item) => ({
    label: item.desc,
    value: item.value,
  }));

  const validatePhone = async (_, value) => {
    if (props.context === 'invite') {
      if (!value) return Promise.resolve(); // Phone is optional

      if (!formComputed.value.phoneCountryCode) {
        return Promise.reject(new Error('Please enter the area code'));
      }

      // Validate phone format
      const phoneRule = getBasicRules(['phone'], getFormLabel('phone'))[0];
      const phonePattern = phoneRule.pattern;
      if (!phonePattern.test(value)) {
        return Promise.reject(new Error(phoneRule.message));
      }

      return Promise.resolve();
    } else {
      if (!value) {
        return Promise.reject(new Error(getRequiredMessage('phone')));
      }

      const phoneRule = getBasicRules(['phone'], getFormLabel('phone'))[0];
      const phonePattern = phoneRule.pattern;
      if (!phonePattern.test(value)) {
        return Promise.reject(new Error(phoneRule.message));
      }

      return Promise.resolve();
    }
  };

  const validateMoreAccounts = async (_, value) => {
    if (formComputed.value.otherAccount && !value) {
      return Promise.reject(new Error(getFormPlaceholder('moreAccount')));
    }
    return Promise.resolve();
  };

  const validateContactInfo = async () => {
    if (props.context === 'invite') {
      const { phone, telegram, email } = formComputed.value;
      const filledCount = [phone, telegram, email].filter(Boolean).length;

      if (filledCount < 1) {
        return Promise.reject(new Error('Please provide at least one contact method: phone, Telegram, or email'));
      }
    }
    return Promise.resolve();
  };

  const validateExperienceContent = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error(getCommon('validation.required', { field: 'Strengths & Experience' })));
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
        return Promise.reject(new Error(getCommon('validation.length.min', { field: 'Strengths & Experience', length: 30 })));
      }
    }

    return Promise.resolve();
  };

  const { getLabel, getPlaceholder, getCommon } = useI18nText({ local: 'userCenter.content.resumeEdit' });

  const getFormLabel = (name) => getLabel(`form.${name}`);

  const getFormPlaceholder = (name, isSelect = false) => getPlaceholder(`form.${name}`, isSelect);

  const getRequiredMessage = (name) => getPlaceholder(`form.${name}`, false, 0);

  const formRules = {
    name: [{ required: true, message: getRequiredMessage('enName'), trigger: 'blur' }],
    gender: [{ required: true, message: getRequiredMessage('sex'), trigger: 'change' }],
    age: [{ required: true, message: getRequiredMessage('age'), trigger: 'blur' }],
    nationality: [{ required: true, message: getRequiredMessage('nationality'), trigger: 'change' }],
    education: [{ required: true, message: getRequiredMessage('diploma'), trigger: 'change' }],
    workYears: [{ required: true, message: getRequiredMessage('workExperience'), trigger: 'change' }],
    jobStatus: [{ required: true, message: getRequiredMessage('jobStatus'), trigger: 'change' }],
    currentLocation: [{ required: true, message: getRequiredMessage('location'), trigger: 'change' }],
    phone: [
      { validator: validatePhone, trigger: 'blur' },
      { validator: validateContactInfo, trigger: 'blur' },
    ],
    telegram:
      props.context === 'invite'
        ? getBasicRules(['telegram'], getFormLabel('telegram'))
        : getBasicRules(['required', 'telegram'], getFormLabel('telegram')),
    email: props.context === 'invite' ? getBasicRules(['email'], getFormLabel('email')) : getBasicRules(['required', 'email'], getFormLabel('email')),
    otherAccountValue: [{ validator: validateMoreAccounts, trigger: 'blur' }],
    industry: [{ required: true, message: getRequiredMessage('desiredIndustry'), trigger: 'change' }],
    jobCategory: [{ required: true, message: getRequiredMessage('desiredPosition'), trigger: 'change' }],
    currentSalary: [{ required: true, message: getRequiredMessage('currentMonthlySalary'), trigger: 'change' }],
    expectedSalary: [{ required: true, message: getRequiredMessage('desiredMonthlySalary'), trigger: 'change' }],
    abroadWillingness: [{ required: true, message: getRequiredMessage('goAbroadDesire'), trigger: 'change' }],
    workStyle: [{ required: true, message: getRequiredMessage('workMethod'), trigger: 'change' }],
    city: [{ required: true, message: getRequiredMessage('location'), trigger: 'change' }],
    expectedCountry: [{ required: true, message: getRequiredMessage('countryDesired'), trigger: 'change' }],
    experienceContent: [{ validator: validateExperienceContent, trigger: 'blur' }],
  };

  // Deeply watch form data and notify the parent component to trigger auto-save
  watch(
    () => formComputed.value,
    () => emit('change'),
    { deep: true }
  );

  const handleResumeFileChange = (files) => {
    resumeFiles.value = [...files];
    // Only update form data if files actually exist
    if (files && files.length > 0) {
      formComputed.value.resumeFile = files.map((file) => {
        return {
          name: file.fileName,
          url: file.url,
          size: file.fileSize,
          uploadTime: file.fileDate,
        };
      });
    } else {
      formComputed.value.resumeFile = null;
    }
    emit('files-change', resumeFiles.value);
  };

  const handleResumeFileRemove = () => {
    resumeFiles.value = [];
    formComputed.value.resumeFile = null;
    emit('files-change', resumeFiles.value);
  };

  // Transform the resumeFile data returned by the API into the format expected by the m-upload component
  const transformResumeFiles = (resumeFileData) => {
    if (!resumeFileData || !Array.isArray(resumeFileData)) {
      return [];
    }

    return resumeFileData.map((file, index) => ({
      fileName: file.name,
      url: file.url,
      fileSize: file.size,
      fileDate: file.uploadTime,
      uid: `${file.name}_${index}_${Date.now()}`, // Generate a unique uid
      status: 'done', // Existing files have a status of done
      id: '', // Add the id field here if available
    }));
  };

  // Set resume file data during initialization
  const setResumeFiles = (resumeFileData) => {
    resumeFiles.value = transformResumeFiles(resumeFileData);
  };

  defineExpose({
    validate: async () => {
      const data = await formRef.value?.validate?.();
      console.log(data);
    },
    setResumeFiles,
  });
</script>

<style scoped lang="less">
  .resume-form-title {
    font-size: 16px;
    color: @font-primary-color;
    margin-bottom: 10px;
    span {
      font-size: 16px;
      color: @font-primary-color;
    }
    b {
      color: rgba(255, 87, 51, 1);
      font-weight: normal;
    }
    i {
      font-style: normal;
      font-size: 12px;
      color: @font-tip-color;
    }
    strong {
      color: rgba(255, 141, 26, 1);
      font-weight: 400;
      font-size: 12px;
    }
  }
</style>
