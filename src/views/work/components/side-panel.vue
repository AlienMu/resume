<template>
  <div ref="sidePanelRef" @scroll.passive="onScrollEnd" class="side">
    <a-flex vertical gap="16">
      <job-card
        v-for="item in displayRecords"
        :key="item.id || item._skeletonId"
        :data="item"
        :loading="item._isSkeleton"
        :activated="!item._isSkeleton && currentId === item.id"
        :viewed="!item._isSkeleton && isViewed(item)"
        @click="!item._isSkeleton && onJobCardChange(item)"
      />
      <a-spin v-if="isLoading && hasMore && !isEmpty && !isInitialLoading" :indicator="indicator" :tip="t('list.list.loadingMore')" />
      <a-divider v-else-if="!isLoading && !isInitialLoading && !hasMore">{{ getCommon('tips.notMore') }}</a-divider>
    </a-flex>
  </div>
</template>

<script setup>
  import { computed, h, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import JobCard from '/@/components/business/job-card/job-card.vue';
  import { throttle } from 'lodash';
  import { listJobs } from '/@/api/job';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';

  const { t } = useI18n();
  const { getCommon } = useI18nText({ local: 'list' });

  const indicator = h(LoadingOutlined, {
    style: {
      fontSize: '24px',
    },
    spin: true,
  });

  const createSkeletonItems = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `skeleton-${Date.now()}-${index}`,
      _isSkeleton: true,
      _skeletonId: `skeleton-${Date.now()}-${index}`,
    }));
  };

  const props = defineProps({
    searchForm: {
      type: Object,
      default: () => ({}),
    },
    currentId: {
      type: [Number, null],
      default: undefined,
    },
    searchTrigger: {
      type: Number,
      default: 0,
    },
    firstJobId: {
      type: [Number, undefined],
      default: undefined,
    },
  });

  const emit = defineEmits(['update:currentId']);

  const isLoading = ref(false);
  const isOnMounted = ref(false);
  const jobRecords = ref([]);

  const pagination = ref({
    current: 1,
    size: 10,
    total: 0,
    pages: 1,
  });

  const hasMore = computed(() => pagination.value.current < pagination.value.pages);
  const isInitialLoading = computed(() => isLoading.value && pagination.value.current === 1 && jobRecords.value.length === 0);
  const isEmpty = computed(() => !isLoading.value && jobRecords.value.length === 0);

  const skeletonItems = ref([]);
  const sidePanelRef = ref(null);

  const displayRecords = computed(() => {
    if (isLoading.value && skeletonItems.value.length > 0) {
      return skeletonItems.value;
    }
    return jobRecords.value;
  });

  onMounted(() => {});

  const onScrollEnd = throttle(
    (event) => {
      if (!hasMore.value || isLoading.value) return;
      const isBottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 50;
      if (!isBottom) return;
      const nextPage = (pagination.value.current || 1) + 1;
      fetchJobRecords(nextPage, true).catch(() => {});
    },
    100,
    {
      leading: false,
      trailing: true,
    }
  );

  const buildQueryParams = (page) => {
    const params = {
      current: page,
      size: pagination.value.size,
      firstJobId: props.firstJobId,
    };
    Object.entries(props.searchForm || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    return params;
  };

  const fetchJobRecords = async (page = 1, append = false) => {
    if (isLoading.value) return;
    try {
      isLoading.value = true;
      // 每次查询时先添加占位数据
      if (!append) {
        skeletonItems.value = createSkeletonItems(pagination.value.size);
      }
      const result = await listJobs(buildQueryParams(page));
      const records = Array.isArray(result?.records) ? result.records : [];
      jobRecords.value = append ? [...jobRecords.value, ...records] : records;
      pagination.value.total = result?.total ?? 0;
      pagination.value.current = result?.current ?? page;
      pagination.value.size = result?.size ?? pagination.value.size;
      pagination.value.pages = result?.pages ?? 1;

      // 清除占位数据
      skeletonItems.value = [];

      if (!append && records.length) {
        // 如果有 firstJobId，优先选中该 job
        if (props.firstJobId && records.some((r) => r.id === props.firstJobId)) {
          emit('update:currentId', props.firstJobId);
        } else {
          emit('update:currentId', records[0]?.id);
        }
      } else if (!props.currentId && jobRecords.value.length) {
        // 如果有 firstJobId，优先选中该 job
        if (props.firstJobId && jobRecords.value.some((r) => r.id === props.firstJobId)) {
          emit('update:currentId', props.firstJobId);
        } else {
          emit('update:currentId', jobRecords.value[0]?.id);
        }
      }
    } catch (error) {
      console.error('[work-list] fetch job list failed', error);
      skeletonItems.value = [];
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const resetAndFetch = async () => {
    if (!isOnMounted.value) return;
    pagination.value.current = 1;
    pagination.value.total = 0;
    pagination.value.pages = 1;
    jobRecords.value = [];
    skeletonItems.value = [];
    await fetchJobRecords(1, false);
  };

  const isViewed = (item) => item?.isViewed === 1;

  const onJobCardChange = (item) => {
    // 标记为已浏览
    if (item && item.isViewed !== 1) {
      item.isViewed = 1;
    }
    emit('update:currentId', item.id);
  };

  watch(
    () => props.searchTrigger,
    (trigger) => {
      if (!trigger) return;
      resetAndFetch();
    },
    { immediate: true }
  );

  watch(
    () => props.searchForm,
    () => {
      if (!isLoading.value) {
        // 等待显式触发 searchTrigger 再执行搜索
      }
    },
    { deep: true }
  );

  const calculateInitialPageSize = () => {
    if (!sidePanelRef.value) return 10;
    const JOB_CARD_HEIGHT = 111;
    const GAP = 16;
    const containerHeight = sidePanelRef.value.clientHeight;
    const DEFAULT_SIZE = 10;
    // 计算10条数据的高度
    const defaultItemsHeight = DEFAULT_SIZE * JOB_CARD_HEIGHT + (DEFAULT_SIZE - 1) * GAP;
    // 如果10条数据高度小于容器高度，说明不够滚动，就用10条
    if (defaultItemsHeight > containerHeight) {
      return DEFAULT_SIZE;
    }
    let checkSize = 20;
    while (checkSize <= 50) {
      // 最多检查到50条
      const checkHeight = checkSize * JOB_CARD_HEIGHT + (checkSize - 1) * GAP;
      if (checkHeight >= containerHeight) {
        return checkSize;
      }
      checkSize += 10;
    }
    // 如果都不够，返回50条
    return 50;
  };

  onMounted(async () => {
    if (sidePanelRef.value) {
      // 计算初始加载数量
      pagination.value.size = calculateInitialPageSize();
      // 加载数据
      await fetchJobRecords(1, false);
      // 加载完成后重置为10条
      pagination.value.size = 10;
      isOnMounted.value = true;
    }
  });

  defineExpose({
    refresh: resetAndFetch,
    isInitialLoading,
    isEmpty,
    isLoading,
  });
</script>

<style scoped lang="less">
  .side {
    height: 100%;
    overflow-y: auto;
  }
</style>
