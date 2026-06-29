<template>
  <div class="talent">
    <talent-banner />
    <talent-search v-model="searchForm" :loading="isSearchLoading" @search="handleSearch" />
    <a-flex align="center" gap="6" class="tips">
      <span class="mui-error-text"><svg-icon name="notice-circle" /></span>
      <span class="mui-error-text mui-font-size-12">{{ getLabel('tips') }}</span>
    </a-flex>
    <div ref="talentContentRef" class="talent-content">
      <a-list :data-source="displayList" item-layout="horizontal" :loading="false">
        <template #loadMore>
          <a-flex style="padding: 20px 0" justify="center" v-if="!isInitLoading && !isLoading">
            <a-button v-if="!isNotMore" type="primary" @click="onLoadMore">{{ getCommon('loadMore') }}</a-button>
            <a-divider v-else>{{ getCommon('tips.notMore') }}</a-divider>
          </a-flex>
        </template>
        <template #renderItem="{ item }">
          <a-list-item style="padding: 16px 0">
            <template #actions>
              <a-skeleton-button style="width: 180px" block avatar :title="false" v-if="isInitLoading || !!item.loading" active />
              <a-button
                :href="router.resolve({ name: 'talent-detail', params: { id: item.id } }).href"
                target="_blank"
                rel="noopener"
                v-if="!isInitLoading || !item.loading"
                type="primary"
              >
                {{ getLabel('list.button') }}
              </a-button>
            </template>
            <a-skeleton avatar :title="false" :loading="isInitLoading || !!item.loading" active>
              <a-flex gap="90" align="center" style="width: 100%">
                <a-list-item-meta>
                  <template #description>
                    <a-typography-paragraph
                      style="margin-bottom: 0"
                      :ellipsis="{ rows: 2, tooltip: false }"
                      :content="item.summary"
                      class="mui-desc-text mui-font-size-12"
                    />
                  </template>
                  <template #title>
                    <a-flex gap="13" align="center">
                      <span class="mui-font-size-16">{{ item.name }}</span>
                      <a-flex gap="8">
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">{{ getFormatText(item.age, 'age') }}</span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">
                          {{ muiEnumPlugin.getDescByValue('GENDER_ENUM', item.gender) }}
                        </span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">
                          {{ item.workYearsShow }}
                        </span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">{{ getFormatText(item.educationShow) }}</span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">{{ getFormatText(item.jobCategoryShow) }}</span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">{{ getFormatText(item.workStyleShow) }}</span>
                        <span class="mui-right-line mui-font-size-12 mui-desc-text">{{
                          getLabel('list.salary', { num: item.expectedSalaryShow })
                        }}</span>
                      </a-flex>
                    </a-flex>
                  </template>
                  <template #avatar>
                    <a-avatar :size="48" :src="item.avatar" style="background: rgba(0, 0, 0, 0.25); border: none" />
                  </template>
                </a-list-item-meta>
                <div class="mui-desc-text mui-font-size-12">{{ getTimeComparison(item.updatedAt) }}</div>
              </a-flex>
            </a-skeleton>
          </a-list-item>
        </template>
      </a-list>
      <a-flex v-if="hasView" gap="50" class="mask" vertical align="center" justify="flex-end">
        <a-flex vertical gap="13" align="center">
          <span style="font-size: 24px">{{ getLabel('mask.title', isNotCompany) }}</span>
          <span v-if="isNotCompany !== 2" class="mui-desc-text mui-font-size-12">{{ getLabel('mask.more') }}</span>
        </a-flex>
        <a-flex gap="10">
          <a-button @click="handleRegister" type="primary">
            {{ getLabel('mask.register', isNotCompany) }}
          </a-button>
          <a-button @click="handleLogin" type="primary">{{ getLabel('mask.login', isNotCompany) }}</a-button>
        </a-flex>
      </a-flex>
    </div>
  </div>
</template>
<script setup>
  import TalentBanner from '/@/views/talent/components/talent-banner.vue';
  import TalentSearch from '/@/views/talent/components/talent-search.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getTimeComparison } from '/@/utils/date-util';
  import { getFormatText } from '/@/utils/str-util';
  import { muiEnumPlugin } from '/@/utils/desc-util';

  import { listResumes } from '/@/api/resume';
  import { USER_TYPE_ENUM } from '/@/constants/api-const';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel, getCommon } = useI18nText({ local: 'talent' });

  const list = ref([]);
  const createSkeletonItems = (prefix = 'talent-skeleton', count = 10) =>
    Array.from({ length: count }).map((_, index) => ({
      id: `${prefix}-${Date.now()}-${index}`,
      loading: true,
    }));
  const skeletonList = computed(() => createSkeletonItems('talent-skeleton', pagination.size));
  const loadMoreSkeletonList = ref([]);

  const isNotCompany = computed(() => {
    if (userType === USER_TYPE_ENUM.PERSON.value || userType === USER_TYPE_ENUM.INVITED.value) {
      return 2;
    } else {
      return 1;
    }
  });

  const displayList = computed(() => {
    if (isInitLoading.value) {
      return skeletonList.value;
    }
    if (loadMoreSkeletonList.value.length) {
      return [...list.value, ...loadMoreSkeletonList.value];
    }
    return list.value;
  });

  const isInitLoading = ref(true);

  const { userType } = useUserStore();

  const isLoading = ref(false);

  const hasView = computed(() => {
    return userType !== USER_TYPE_ENUM.COMPANY.value;
  });

  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0,
    pages: 1,
  });

  const talentContentRef = ref(null);

  const createDefaultSearchForm = () => ({
    keyword: '',
    jobCategory: undefined,
    industry: undefined,
    jobType: undefined,
  });

  const handleRegister = () => {
    if (isNotCompany.value === 2) {
      router.push({ name: 'list' });
      return;
    }
    router.push({ name: 'login', query: { key: 'register', tab: 'company' } });
  };

  const handleLogin = () => {
    if (isNotCompany.value === 2) {
      useUserStore().logout();
      return;
    }
    router.push({ name: 'login' });
  };

  const searchForm = ref(createDefaultSearchForm());
  const router = useRouter();
  const route = useRoute();

  const hasMore = computed(() => pagination.current < pagination.pages);

  const isNotMore = computed(() => !hasMore.value);

  const isSearchLoading = computed(() => isInitLoading.value || isLoading.value);

  const calculateInitialPageSize = () => {
    // 列表项高度（估算）
    const TOTAL_ITEM_HEIGHT = 81;
    const containerHeight = document.querySelector('.ant-layout-content').clientHeight - 200 - 82 - 50 - 76;

    const DEFAULT_SIZE = 10;

    // 计算10条数据的高度
    const defaultItemsHeight = DEFAULT_SIZE * TOTAL_ITEM_HEIGHT;
    // 如果10条数据高度小于容器高度，说明不够滚动，就用10条
    if (defaultItemsHeight > containerHeight) {
      return DEFAULT_SIZE;
    }

    // 如果10条数据高度大于等于容器高度，说明够滚动了
    // 继续检查20条、30条...找到刚好够滚动的数量
    let checkSize = 20;
    while (checkSize <= 50) {
      // 最多检查到50条
      const checkHeight = checkSize * TOTAL_ITEM_HEIGHT;
      if (checkHeight >= containerHeight) {
        return checkSize;
      }
      checkSize += 10;
    }

    // 如果都不够，返回50条
    return 50;
  };

  const buildQueryParams = (page = 1) => {
    const params = {
      current: page,
      size: hasView.value ? 6 : pagination.size,
    };
    Object.entries(searchForm.value || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    return params;
  };

  const buildSearchQuery = (form = {}) => {
    const query = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value;
      }
    });
    return query;
  };

  const parseSearchFormFromQuery = (query = {}) => {
    const next = createDefaultSearchForm();
    Object.keys(next).forEach((key) => {
      if (query[key] !== undefined) {
        const value = query[key];
        if (key === 'workStyle') {
          const parsed = Number(value);
          next[key] = Number.isNaN(parsed) ? undefined : parsed;
        } else {
          next[key] = value;
        }
      }
    });
    return next;
  };

  const updateRouteQuery = () => {
    const query = buildSearchQuery(searchForm.value);
    router.replace({
      name: route.name || 'talent',
      params: route.params,
      query,
    });
  };

  const normalizeResumeRecord = (record = {}) => ({
    loading: false,
    ...record,
  });

  const fetchResumeList = async (page = 1, append = false) => {
    if (isLoading.value) return;
    isLoading.value = true;
    if (append) {
      const remaining = Math.max((pagination.total || list.value.length) - list.value.length, 0);
      const placeholderCount = Math.min(remaining || pagination.size || 10, 10);
      loadMoreSkeletonList.value = placeholderCount ? createSkeletonItems('talent-load-more', placeholderCount) : [];
    } else {
      isInitLoading.value = true;
    }
    try {
      const result = await listResumes(buildQueryParams(page));
      const records = Array.isArray(result?.records) ? result.records : [];
      const nextList = records.map((item) => normalizeResumeRecord(item));
      list.value = append ? [...list.value, ...nextList] : nextList;
      pagination.total = result?.total ?? nextList.length;
      pagination.current = result?.current ?? page;
      pagination.size = result?.size ?? pagination.size;
      pagination.pages = result?.pages ?? (pagination.total ? Math.ceil(pagination.total / pagination.size) : 1);
    } finally {
      isLoading.value = false;
      isInitLoading.value = false;
      loadMoreSkeletonList.value = [];
    }
  };

  const handleSearch = (filters) => {
    if (filters) {
      searchForm.value = {
        ...createDefaultSearchForm(),
        ...filters,
      };
    }
    pagination.current = 1;
    updateRouteQuery();
    fetchResumeList(1, false);
  };

  const onLoadMore = () => {
    if (isLoading.value || !hasMore.value) return;
    const nextPage = (pagination.current || 1) + 1;
    fetchResumeList(nextPage, true);
  };

  onMounted(async () => {
    searchForm.value = parseSearchFormFromQuery(route.query);

    // 如果不是企业用户，不需要动态计算
    if (hasView.value) {
      handleSearch();
      return;
    }

    if (talentContentRef.value) {
      // 计算初始加载数量

      pagination.size = calculateInitialPageSize();

      // 加载数据
      await fetchResumeList(1, false);

      // 加载完成后重置为10条
      pagination.size = 10;
    } else {
      handleSearch();
    }
  });
</script>
<style lang="less" scoped>
  .talent {
    max-width: 1440px;
    margin: 0 auto;
    .tips {
      margin-top: 24px;
    }
    .talent-content {
      margin-top: 12px;
      margin-bottom: 20px;
      padding: 9px 28px;
      background: @base-bg-color;
      border-radius: 8px;
      position: relative;
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        padding-bottom: 100px;
        background: linear-gradient(360deg, rgba(240, 244, 247, 1) 50.81%, rgba(255, 255, 255, 0) 100%);
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
<route>
{
parentId: 0,
auth: 'talent',
sort: 2
}
</route>
