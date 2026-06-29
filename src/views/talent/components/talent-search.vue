<template>
  <div class="work-search">
    <a-flex class="work-search-flex" gap="12">
      <a-input-group compact class="work-search-wrap">
        <a-input
          v-model:value.trim="filters.keyword"
          class="input"
          :placeholder="getCommon('form.placeholders.searchKeywords')"
          @pressEnter="handleSearch"
        />
        <dictionary-select
          v-model:value="filters.industry"
          class="work-search-select"
          type="industry_sector"
          :placeholder="getCommon('form.fieldNames.industry')"
          allow-clear
          isCustomerIcon
        />
        <dictionary-select
          v-model:value="filters.jobCategory"
          class="work-search-select"
          type="job_category"
          cascader
          :placeholder="getCommon('form.fieldNames.jobCategory')"
          allow-clear
          isCustomerIcon
        />
        <dictionary-select
          v-model:value="filters.jobType"
          type="job_nature"
          class="work-search-select"
          :placeholder="getCommon('form.fieldNames.jobType')"
          allow-clear
          isCustomerIcon
        />
        <div class="button">
          <a-button type="primary" :loading="loading" @click="handleSearch">{{ getLabel('search.button') }}</a-button>
        </div>
      </a-input-group>
      <a-button
        v-if="!isLoggedIn"
        @click="router.push({ name: 'login', query: { key: 'register', tab: 'company' } })"
        type="primary"
        class="register-button"
      >
        {{ getLabel('search.registerButton') }}
      </a-button>
      <div class="work-search-hot" v-if="hotCategories.length">
        <a-flex align="center" gap="8">
          <span class="mui-font-size-12 mui-desc-text">{{ getLabel('search.hotJob') }}</span>
          <a-button
            type="link"
            size="small"
            v-for="item in hotCategories"
            :key="item.id || item.name"
            class="mui-font-size-12 mui-desc-text hot-job-item"
            @click="handleHotCategoryClick(item)"
          >
            {{ item.name }}
          </a-button>
        </a-flex>
      </div>
    </a-flex>
  </div>
</template>

<script setup>
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { reactive, watch, ref, onMounted, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import { getHotJobs } from '/@/api/job';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel, getCommon } = useI18nText({ local: 'talent' });
  const userStore = useUserStore();

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'search']);

  const filters = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  const HOT_JOB_LIMIT = 10;
  const hotCategories = ref([]);
  const router = useRouter();
  const isHotLoading = ref(false);
  const isLoggedIn = computed(() => !!userStore.getToken);

  const handleSearch = () => {
    emit('search', props.modelValue);
  };

  const normalizeHotCategoryRecord = (record = {}) => {
    return {
      id: record.itemKey,
      name: record.name,
      itemKey: record.itemKey,
    };
  };

  const fetchHotCategories = async () => {
    if (isHotLoading.value) return;
    isHotLoading.value = true;
    try {
      const result = await getHotJobs({ current: 1, size: HOT_JOB_LIMIT });
      const categories = Array.isArray(result?.topCategories) ? result.topCategories : [];
      hotCategories.value = categories
        .map((item) => normalizeHotCategoryRecord(item))
        .filter((item) => item.name)
        .slice(0, HOT_JOB_LIMIT);
    } finally {
      isHotLoading.value = false;
    }
  };

  const handleHotCategoryClick = (category) => {
    if (!category) return;
    // 设置职位类别，清空其他筛选条件
    filters.value.jobCategory = category.itemKey;
    filters.value.keyword = undefined;
    filters.value.industry = undefined;
    filters.value.jobType = undefined;
    handleSearch();
  };

  onMounted(fetchHotCategories);
</script>

<style scoped lang="less">
  .work-search {
    text-align: center;

    .register-button {
      border-radius: 8px;
      background: linear-gradient(270deg, rgba(0, 106, 255, 1) 0%, rgba(151, 77, 255, 1) 100%);
      height: 52px !important;
      line-height: 52px !important;
      font-size: 18px !important;
      min-width: 200px !important;
      padding: 0 24px;
      white-space: nowrap;
      border: none;
    }
    .work-search-wrap {
      display: inline-flex;
      flex: 0 0;
      border: none;
    }
    .input {
      font-size: 16px;
      padding: 14.5px 11px;
      width: 575px;
      text-align: left;
      border: none;
      &:focus {
        box-shadow: none;
        border: none;
      }
    }
    .button {
      padding: 8px;
      background: #fff;
      :deep(.ant-btn) {
        padding: 0;
        height: 40px;
        width: 104px;
        font-size: 14px;
      }
    }

    .work-search-flex {
      display: inline-flex;
      flex-wrap: nowrap;
      position: relative;
      padding-bottom: 26px;
    }

    .work-search-hot {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .hot-job-item {
      padding: 0;
      &:not(:last-child) {
        padding-right: 9px;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          right: -1px;
          top: 50%;
          transform: translateY(-50%);
          height: 10px;
          width: 1px;
          background: rgba(204, 204, 204, 1);
        }
      }
    }

    .work-search-select {
      width: 120px;
      height: 56px;
      &:before {
        content: '';
        position: absolute;
        width: 1px;
        height: 21px;
        background: rgba(213, 221, 232, 1);
        left: 0;
        top: 50%;
        z-index: 2;
        transform: translateY(-50%);
      }
      :deep(.ant-select-selection-placeholder),
      :deep(.ant-select-selection-item) {
        text-align: center;
      }
    }
  }
</style>
