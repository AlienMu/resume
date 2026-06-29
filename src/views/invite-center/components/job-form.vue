<template>
  <a-form ref="formRef" :model="formComputed" style="margin-bottom: 20px">
    <a-flex vertical gap="30" style="width: 100%">
      <!-- Job position section -->
      <a-flex vertical gap="10">
        <a-flex vertical class="resume-form-title">
          <span>{{ getI18nLabel('formTitle[0]', 1) }}</span>
          <i>{{ getI18nLabel('formTitle[0]', 2) }}</i>
        </a-flex>
        <a-flex vertical>
          <a-row :gutter="10">
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobTitle" required :label="getI18nLabel('form.jobTitle')">
                <a-input :maxlength="25" :placeholder="getPlaceholder('form.jobTitle')" v-model:value.trim="formComputed.jobTitle" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="deadTime" required :label="getI18nLabel('form.deadTime')">
                <a-date-picker :placeholder="getPlaceholder('form.deadTime', true)" v-model="formComputed.deadTime" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobCategory" required :label="getI18nLabel('form.jobCategory')">
                <m-select :placeholder="getPlaceholder('form.jobCategory', true)" v-model="formComputed.jobCategory" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobTag" required :label="getI18nLabel('form.jobTag')">
                <m-select :placeholder="getPlaceholder('form.jobTag', true)" v-model="formComputed.jobType" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="monthlySalary" required :label="getI18nLabel('form.monthlySalary')">
                <m-select :placeholder="getPlaceholder('form.monthlySalary', true)" v-model="formComputed.salaryMax" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="recruitCount" required :label="getI18nLabel('form.recruitCount')">
                <m-select :placeholder="getPlaceholder('form.recruitCount', true)" v-model="formComputed.recruitCount" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="jobType" required :label="getI18nLabel('form.jobType')">
                <m-select :placeholder="getPlaceholder('form.jobType', true)" v-model="formComputed.city" />
              </m-form-item>
            </a-col>
            <a-col :span="FORM_SPAN">
              <m-form-item name="city" required :label="getI18nLabel('form.city')">
                <m-select :placeholder="getPlaceholder('form.city', true)" v-model="formComputed.city" />
              </m-form-item>
            </a-col>
          </a-row>
        </a-flex>
      </a-flex>
      <!-- Job requirements section -->
      <a-flex vertical gap="10">
        <div class="resume-form-title">{{ getI18nLabel('formTitle[1]') }}</div>
        <a-row :gutter="10">
          <a-col :span="FORM_SPAN">
            <m-form-item name="workYearsMin" required :label="getI18nLabel('form.workYearsMin')">
              <m-select :placeholder="getPlaceholder('form.workYearsMin', true)" v-model="formComputed.workYearsMin" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="educationRequired" required :label="getI18nLabel('form.educationRequired')">
              <m-select :placeholder="getPlaceholder('form.educationRequired', true)" v-model="formComputed.educationRequired" />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="languageRequirements" required :label="getI18nLabel('form.languageRequirements')">
              <m-select :placeholder="getPlaceholder('form.languageRequirements', true)" v-model="formComputed.languageRequirements" multiple />
            </m-form-item>
          </a-col>
          <a-col :span="FORM_SPAN">
            <m-form-item name="nationality" required :label="getI18nLabel('form.nationality')">
              <m-select :placeholder="getPlaceholder('form.nationality', true)" v-model="formComputed.nationality" />
            </m-form-item>
          </a-col>
        </a-row>
      </a-flex>
      <!-- Job description section -->
      <a-flex vertical gap="10">
        <div class="resume-form-title">{{ getI18nLabel('formTitle[2]') }}</div>
        <m-form-item name="description" :rules="[{ required: true, message: getPlaceholder('form.description') }]">
          <div style="width: 100%; padding: 10px">
            <a-textarea
              :bordered="false"
              :placeholder="getI18nLabel('placeholder')"
              :rows="13"
              style="width: 100%; resize: none"
              show-count
              :maxlength="1000"
              v-model:value="formComputed.description"
            />
          </div>
        </m-form-item>
      </a-flex>
    </a-flex>
  </a-form>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import i18n from '/@/i18n';
  import MSelect from '/@/components/mui/m-select/m-select.vue';

  import { useI18nText } from '/@/hooks/use-i18n-text';
  const { getPlaceholder, getLabel } = useI18nText({ local: 'enterpriseCenter.jobEdit' });
  const getI18nLabel = (name, ...arg) => getLabel(name, ...arg);
  

  const FORM_SPAN = 6;

  const props = defineProps({
    form: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:form']);

  const formRef = ref();

  const formComputed = computed({
    set(value) {
      emit('update:form', value);
    },
    get() {
      return props.form;
    },
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
    }
    strong {
      color: rgba(255, 141, 26, 1);
      font-weight: 400;
      font-size: 12px;
    }
  }
</style>
