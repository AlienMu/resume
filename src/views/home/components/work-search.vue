<template>
  <div class="work-search">
    <a-flex justify="center" gap="12" class="work-search-flex">
      <a-input-group compact class="work-search-wrap">
        <dictionary-select
          v-model:value="form.jobCategory"
          class="work-search-select"
          type="job_category"
          cascader
          is-customer-icon
          :allow-clear="true"
          :placeholder="getCommon('form.fieldNames.jobCategory')"
        />
        <a-input
          v-model:value.trim="form.keyword"
          class="input"
          :style="{ width: isLoggedIn ? '775px' : '575px' }"
          :placeholder="$t('common.form.placeholders.searchKeywords')"
          @pressEnter="handleSearch"
        />
        <div class="button">
          <a-button type="primary" style="padding: 0" @click="handleSearch">{{ $t('work.search.button') }}</a-button>
        </div>
      </a-input-group>
      <a-button
        v-if="!isLoggedIn"
        @click="router.push({ name: 'login', query: { key: 'register', tab: 'job' } })"
        type="primary"
        class="register-button"
      >
        {{ $t('work.search.registerButton') }}
      </a-button>
      <div class="work-search-hot" v-if="hotCategories.length">
        <a-flex align="center" gap="8">
          <span class="mui-font-size-12 mui-desc-text" style="color: #fff">{{ $t('work.search.hotJob') }}</span>
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
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { buildJobSearchQuery } from '../utils/job';
  import DictionarySelect from '/@/components/business/dictionary-select/dictionary-select.vue';
  import { getHotJobs } from '/@/api/job';
  import { useUserStore } from '/@/store/modules/system/user';
  import { useI18nText } from '/@/hooks/use-i18n-text';

  const { getCommon } = useI18nText();
  const router = useRouter();
  const userStore = useUserStore();
  const HOT_JOB_LIMIT = 10;

  const form = reactive({
    keyword: '',
    jobCategory: undefined,
    industry: undefined,
    jobType: undefined,
  });

  const hotCategories = ref([]);
  const isHotLoading = ref(false);
  const isLoggedIn = computed(() => !!userStore.getToken);

  const handleSearch = () => {
    const query = buildJobSearchQuery(form);
    router.push({
      name: 'list',
      query,
    });
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
    form.jobCategory = category.itemKey;
    form.keyword = undefined;
    form.jobType = undefined;
    form.industry = undefined;
    handleSearch();
  };

  onMounted(fetchHotCategories);
</script>

<style scoped lang="less">
  .work-search {
    text-align: center;

    .register-button {
      border-radius: 8px;
      background: linear-gradient(67.39deg, rgba(151, 77, 255, 1) 0%, rgba(0, 5, 77, 1) 24.87%, rgba(0, 106, 255, 1) 100%);
      height: 52px !important;
      line-height: 52px !important;
      font-size: 18px !important;
      min-width: 200px;
      padding: 0 24px;
      border: none;
      white-space: nowrap;
    }
    .work-search-wrap {
      display: flex;
      flex: 0 0;
      border: none;
      :deep(.ant-btn) {
        height: 40px;
        width: 104px;
        font-size: 14px;
      }
    }
    .input {
      font-size: 16px;
      padding: 14.5px 11px;

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
      width: 150%;
    }

    .hot-job-item {
      padding: 0;
      color: #fff;

      text-overflow: ellipsis;
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
      width: 145px;
      height: 56px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        right: 0;
        top: 10px;
        height: calc(100% - 20px);
        width: 1px;
        background-color: rgba(213, 221, 232, 1);
        z-index: 2;
      }
    }
  }
</style>
