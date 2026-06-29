<template>
  <a-form ref="formRef" :model="formComputed" style="margin-bottom: 20px">
    <a-flex vertical gap="30" style="width: 100%">
      <!-- Recruitment position section -->
      <a-flex vertical gap="10">
        <a-flex class="resume-form-title" align="center" gap="10">
          <span>{{ getI18nLabel('formTitle[0]', 1) }}</span>
          <i>{{ getI18nLabel('formTitle[0]', 2) }}</i>
        </a-flex>
        <template v-if="loading">
          <a-flex vertical>
            <a-row :gutter="10">
              <a-col :span="FORM_SPAN" v-for="i in 8" :key="`field-${i}`">
                <a-flex vertical gap="8" style="padding-bottom: 20px">
                  <a-skeleton-button block active style="width: 100%; height: 36px" />
                </a-flex>
              </a-col>
            </a-row>
          </a-flex>
        </template>
        <a-flex v-else vertical>
          <a-row :gutter="10">
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobTitle" required :label="getI18nLabel('form.jobTitle')">
                <a-input
                  :maxlength="25"
                  :placeholder="getPlaceholder('form.jobTitle')"
                  :disabled="jobTitleDisabled"
                  v-model:value.trim="formComputed.jobTitle"
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="expiredAt" required :label="getI18nLabel('form.deadTime')">
                <a-date-picker
                  style="width: 100%"
                  :placeholder="getPlaceholder('form.deadTime', true)"
                  v-model:value="formComputed.expiredAt"
                  disabled
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="industry" required :label="getI18nLabel('form.industry')">
                <dictionary-select
                  type="industry_sector"
                  :placeholder="getPlaceholder('form.industry', true)"
                  v-model:value="formComputed.industry"
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobCategory" required :label="getI18nLabel('form.jobCategory')">
                <dictionary-select
                  type="job_category"
                  cascader
                  :placeholder="getPlaceholder('form.jobCategory', true)"
                  v-model:value="formComputed.jobCategory"
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="salaryRange" required :label="getI18nLabel('form.monthlySalary')">
                <dictionary-select
                  type="salary_range"
                  :placeholder="getPlaceholder('form.monthlySalary', true)"
                  v-model:value="formComputed.salaryRange"
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="recruitmentNumber" required :label="getI18nLabel('form.recruitCount')">
                <dictionary-select
                  type="recruitment_number"
                  :placeholder="getPlaceholder('form.recruitCount', true)"
                  v-model:value="formComputed.recruitmentNumber"
                />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobNature" required :label="getI18nLabel('form.jobType')">
                <dictionary-select type="job_nature" :placeholder="getPlaceholder('form.jobType', true)" v-model:value="formComputed.jobNature" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="workLocation" required :label="getI18nLabel('form.city')">
                <dictionary-select
                  type="expected_country"
                  :placeholder="getPlaceholder('form.city', true)"
                  v-model:value="formComputed.workLocation"
                />
              </m-form-item>
            </a-col>
          </a-row>
        </a-flex>
      </a-flex>
      <!-- Job requirements section -->
      <a-flex vertical gap="10">
        <div class="resume-form-title">{{ getI18nLabel('formTitle[1]') }}</div>
        <template v-if="loading">
          <a-row :gutter="10">
            <a-col :span="FORM_SPAN" v-for="i in 4" :key="`requirement-${i}`">
              <a-flex vertical gap="8">
                <a-skeleton-button block active style="width: 100%; height: 36px" />
              </a-flex>
            </a-col>
          </a-row>
        </template>
        <a-row v-else :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="workExperience" required :label="getI18nLabel('form.workYearsMin')">
              <dictionary-select
                type="work_experience"
                :placeholder="getPlaceholder('form.workYearsMin', true)"
                v-model:value="formComputed.workExperience"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="education" required :label="getI18nLabel('form.educationRequired')">
              <dictionary-select
                type="education"
                :placeholder="getPlaceholder('form.educationRequired', true)"
                v-model:value="formComputed.education"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="languageRequirements" required :label="getI18nLabel('form.languageRequirements')">
              <dictionary-select
                multiple
                type="language_requirement"
                :placeholder="getPlaceholder('form.languageRequirements', true)"
                v-model:value="formComputed.languageRequirements"
              />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="nationalityRequirements" required :label="getI18nLabel('form.nationality')">
              <dictionary-select
                multiple
                type="country_location"
                :placeholder="getPlaceholder('form.nationality', true)"
                v-model:value="formComputed.nationalityRequirements"
              />
            </m-form-item>
          </a-col>
        </a-row>
      </a-flex>
      <!-- Job description section -->
      <a-flex vertical gap="10">
        <div class="resume-form-title">{{ getI18nLabel('formTitle[2]') }}</div>
        <template v-if="loading">
          <div style="width: 100%">
            <a-skeleton :paragraph="{ rows: 13 }" active :title="false" />
          </div>
        </template>
        <a-form-item v-else name="jobDescription" :rules="[{ validator: validateJobDescription, trigger: 'blur' }]">
          <rich-edit :placeholder="getI18nLabel('placeholder')" :max-length="2000" v-model:value="formComputed.jobDescription" />
        </a-form-item>
      </a-flex>
    </a-flex>
  </a-form>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import RichEdit from '/@/components/framework/rich-edit/rich-edit.vue';

  const { getLabel, getPlaceholder } = useI18nText({ local: 'enterpriseCenter.jobEdit' });
  const getI18nLabel = (name, ...arg) => getLabel(name, ...arg);

  const FORM_SPAN = 6;

  const props = defineProps({
    form: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    jobTitleDisabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:form']);

  const formRef = ref();

  const formComputed = computed({
    set(value) {
      console.log(value);
      emit('update:form', value);
    },
    get() {
      return props.form;
    },
  });

  const validateJobDescription = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error(getI18nLabel('message.jobDescriptionRequired')));
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
        return Promise.reject(new Error(getI18nLabel('message.jobDescriptionMinLength')));
      }
    }

    return Promise.resolve();
  };

  defineExpose({
    validate: () => formRef.value?.validate?.(),
    getFormRef: () => formRef.value,
  });
</script>

<style scoped lang="less">
  .resume-form-title {
    font-size: 16px;
    color: @font-primary-color;
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
      line-height: 12px;
    }
    strong {
      color: rgba(255, 141, 26, 1);
      font-weight: 400;
      font-size: 12px;
    }
  }
  .rich-text-footer {
    position: absolute;
    right: 12px;
    bottom: 8px;
    pointer-events: none;
  }
  .rich-text-counter {
    font-size: 12px;
    color: @font-tip-color;
  }
  .rich-text-counter--error {
    color: @primary-color;
  }
</style>
