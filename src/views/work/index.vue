<template>
  <div class="work-more" :class="{ 'has-hot-tags': hasHotTags }">
    <work-search v-model="searchForm" @search="handleSearch" @hotTagsLoaded="onHotTagsLoaded" />
    <div class="wrap">
      <a-flex v-show="!sidePanelRef?.isEmpty" class="warp-padding" justify="center" gap="20">
        <div class="side-panel has-search">
          <side-panel
            ref="sidePanelRef"
            v-model:currentId="currentId"
            :search-form="searchForm"
            :search-trigger="searchTrigger"
            :first-job-id="firstJobId"
          />
        </div>
        <div class="content has-search">
          <work-detail :currentId="currentId" :externalLoading="sidePanelRef?.isInitialLoading" />
        </div>
      </a-flex>
      <m-empty v-show="sidePanelRef?.isEmpty" />
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import WorkSearch from './components/work-more-search.vue';
  import SidePanel from './components/side-panel.vue';
  import WorkDetail from './components/work-detail.vue';
  import { buildJobSearchQuery } from '../home/utils/job';
  import MEmpty from '/@/components/mui/m-empty/m-empty.vue';

  const createDefaultSearchForm = () => ({
    keyword: '',
    jobCategory: undefined,
    industry: undefined,
    jobType: undefined,
  });

  const searchForm = ref(createDefaultSearchForm());
  const searchTrigger = ref(0);
  const currentId = ref();
  const sidePanelRef = ref();
  const hasHotTags = ref(false);
  const onHotTagsLoaded = (flag) => {
    hasHotTags.value = !!flag;
  };
  const router = useRouter();
  const route = useRoute();
  const firstJobId = ref(route.query.firstJobId ? Number(route.query.firstJobId) : undefined);

  const parseSearchFormFromQuery = (query = {}) => {
    const next = createDefaultSearchForm();
    Object.keys(next).forEach((key) => {
      if (query[key] !== undefined) {
        const value = query[key];
        if (key === 'jobType') {
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
    const query = buildJobSearchQuery(searchForm.value);
    // 保留 firstJobId 参数
    if (firstJobId.value) {
      query.firstJobId = firstJobId.value;
    }
    router.replace({
      name: 'list',
      params: route.params,
      query,
    });
  };

  const handleSearch = (filters) => {
    if (filters) {
      searchForm.value = {
        ...createDefaultSearchForm(),
        ...filters,
      };
    }
    currentId.value = undefined;
    searchTrigger.value += 1;
    updateRouteQuery();
  };

  onMounted(() => {
    searchForm.value = parseSearchFormFromQuery(route.query);
    firstJobId.value = route.query.firstJobId ? Number(route.query.firstJobId) : undefined;
    handleSearch();
  });

  // 监听路由变化，更新 firstJobId
  watch(
    () => route.query.firstJobId,
    (newFirstJobId) => {
      firstJobId.value = newFirstJobId ? Number(newFirstJobId) : undefined;
    }
  );
</script>
<style lang="less" scoped>
  .work-more {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    .wrap {
      box-sizing: border-box;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
    }

    .warp-padding {
      height: 100%;
    }

    .side-panel {
      width: 456px;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      background: #fff;
      border-radius: 8px;
    }
  }
</style>
<route>
{
parentId: 0,
auth: 'list',
sort: 2,
}
</route>
