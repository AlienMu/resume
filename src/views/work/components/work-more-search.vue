<template>
  <div class="work-more-search">
    <div class="work-more-search-flex">
      <a-flex justify="center" gap="12" align="center">
        <a-input-group compact class="work-more-search-wrap">
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
            isCustomerIcon
            :placeholder="getCommon('form.fieldNames.industry')"
            allow-clear
          />
          <dictionary-select
            v-model:value="filters.jobCategory"
            class="work-search-select"
            type="job_category"
            cascader
            isCustomerIcon
            :placeholder="getCommon('form.fieldNames.jobCategory')"
            allow-clear
          />
          <dictionary-select
            v-model:value="filters.jobType"
            class="work-search-select"
            type="job_nature"
            isCustomerIcon
            :placeholder="getCommon('form.fieldNames.jobType')"
            allow-clear
          />
        </a-input-group>
        <div class="button">
          <a-button type="primary" @click="handleSearch">{{ $t('work.search.button') }}</a-button>
        </div>
        <a-button
          v-if="!isLoggedIn"
          @click="router.push({ name: 'login', query: { key: 'register', tab: 'job' } })"
          type="primary"
          class="register-button"
        >
          {{ $t('work.search.registerButton') }}
        </a-button>
      </a-flex>
      <div class="hot-tags" v-if="hotCategories.length">
        <div class="hot-tag" v-for="category in hotCategories" :key="category.id" @click="handleHotCategoryClick(category)">
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/system/user';
  import { message } from 'ant-design-vue';
  import { getHotJobs } from '/@/api/job';

  const { getCommon } = useI18nText();

  const router = useRouter();
  const userStore = useUserStore();

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:modelValue', 'search', 'hotTagsLoaded']);

  const filters = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  const handleSearch = () => {
    emit('search', props.modelValue);
  };

  const isLoggedIn = computed(() => !!userStore.getToken);
  const HOT_JOB_LIMIT = 10;
  const hotCategories = ref([]);
  const isHotLoading = ref(false);

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
      // notify parent whether there are hot tags
      emit('hotTagsLoaded', Array.isArray(hotCategories.value) && hotCategories.value.length > 0);
    }
  };

  const handleHotCategoryClick = (category) => {
    if (!category) return;
    // 设置职位类别，清空其他筛选项
    const nextFilters = {
      ...props.modelValue,
      keyword: undefined,
      jobCategory: category.itemKey,
      industry: undefined,
      jobType: undefined,
    };
    emit('update:modelValue', nextFilters);
    emit('search', nextFilters);
  };

  onMounted(fetchHotCategories);
</script>

<style scoped lang="less">
  .work-more-search {
    text-align: center;
    background: #fff;
    padding: 14px 0;
    flex-shrink: 0;

    .work-more-search-flex {
      position: relative;
      padding-bottom: 34px;
      display: inline-flex;
    }
    .register-button {
      border-radius: 8px;
      background: linear-gradient(270deg, rgba(0, 106, 255, 1) 0%, rgba(151, 77, 255, 1) 100%);
      height: 36px !important;
      line-height: 36px !important;
      font-size: 18px !important;
      min-width: 200px !important;
      padding: 0 24px;
      white-space: nowrap;
      border: none;
    }
    .work-more-search-wrap {
      display: flex;
      flex: 0 0;
      border: none;
    }
    .input {
      font-size: 16px;
      padding: 10px 16px;
      height: 36px;
      width: 575px;
      text-align: left;
      border: none;
      background: @border-color;
      &:focus {
        box-shadow: none;
        border: none;
      }
    }

    .icon {
      transition-duration: 300ms;
    }

    .work-search-select {
      width: 120px;
      height: 36px;
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

      :deep(.ant-select-selector) {
        background: rgba(240, 244, 247, 1);
      }
      :deep(.ant-select-selection-placeholder),
      :deep(.ant-select-selection-item) {
        text-align: center;
        padding-inline-start: 10px !important;
        padding-inline-end: 25px !important;
      }
    }
    .hot-tags {
      margin-top: 14px;
      display: flex;

      bottom: 0;
      left: 0;
      position: absolute;
      justify-content: center;
    }
    .hot-tag {
      background: rgba(240, 244, 247, 1);
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      border-radius: 4px;
      padding: 0 8px;
      color: rgba(0, 0, 0, 0.85);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
  }
</style>
