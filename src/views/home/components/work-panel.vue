<template>
  <a-flex gap="20" class="work-panel">
    <div class="work-panel-banner" :style="{ backgroundImage: `url(${panelImageUrl})` }">
      <a-flex align="flex-start" gap="14" vertical justify="center">
        <div class="title">{{ title }}</div>
        <div class="sub-title">{{ subTitle }}</div>
        <a-button @click="handleMoreClick" class="button" type="primary">{{ $t('work.choice.more') }}</a-button>
      </a-flex>
    </div>
    <div class="panel-content">
      <a-flex v-if="hasRecords || loading" wrap="wrap" gap="12">
        <div
          @click="handleJobCardClick(item)"
          v-for="(item, index) in displayRecords"
          :key="item?.id ?? item?._skeletonId ?? index"
          class="panel-card"
        >
          <job-card :data="item" :loading="item?._isSkeleton" />
        </div>
      </a-flex>
      <a-flex v-if="!loading && !hasRecords" align="center" justify="center" class="panel-empty">
        <m-empty size="small" />
      </a-flex>
    </div>
  </a-flex>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import JobCard from '/@/components/business/job-card/job-card.vue';
  import MEmpty from '/@/components/mui/m-empty/m-empty.vue';
  import panel1 from '/@/assets/images/work/panel-1.png';
  import panel2 from '/@/assets/images/work/panel-2.png';
  import panel3 from '/@/assets/images/work/panel-3.png';
  import panel4 from '/@/assets/images/work/panel-4.png';
  import { useRouter } from 'vue-router';
  import { buildJobSearchQuery } from '../utils/job';

  const router = useRouter();
  const SKELETON_COUNT = 4;

  const props = defineProps({
    searchKey: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    records: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
    panelIndex: {
      type: Number,
      default: 1,
    },
  });

  const panelImageMap = {
    'panel-1.png': panel1,
    'panel-2.png': panel2,
    'panel-3.png': panel3,
    'panel-4.png': panel4,
  };

  // 根据 panelIndex 获取对应的图片 URL
  const panelImageUrl = computed(() => {
    const fileName = `panel-${props.panelIndex}.png`;
    return panelImageMap[fileName] || '';
  });

  const normalizedRecords = computed(() => (Array.isArray(props.records) ? props.records : []));
  const hasRecords = computed(() => normalizedRecords.value.length > 0);
  const loading = computed(() => props.loading);

  const createSkeletonItems = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      _isSkeleton: true,
      _skeletonId: `skeleton-${Date.now()}-${index}`,
    }));
  };

  const skeletonItems = ref(createSkeletonItems(SKELETON_COUNT));

  const displayRecords = computed(() => {
    if (loading.value) {
      return skeletonItems.value;
    }
    return normalizedRecords.value;
  });

  // 监听 loading 状态，当开始加载时显示占位，加载完成时清除
  watch(
    () => props.loading,
    (newLoading) => {
      if (newLoading) {
        skeletonItems.value = createSkeletonItems(SKELETON_COUNT);
      } else {
        skeletonItems.value = [];
      }
    },
    { immediate: true }
  );

  const handleJobCardClick = (item) => {
    if (item?._isSkeleton || !item?.id) return;
    router.push({
      name: 'list',
      query: {
        firstJobId: item.id,
      },
    });
  };

  const handleMoreClick = () => {
    const query = buildJobSearchQuery({
      industry: props.searchKey,
    });
    router.push({
      name: 'list',
      query,
    });
  };
</script>

<style scoped lang="less">
  .work-panel {
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 8px;

    .work-panel-banner {
      width: 448px;
      height: 226px;
      flex: 0 0 auto;
      background-repeat: no-repeat;
      background-size: cover;
      padding: 0 45px;
      display: flex;
      align-items: center;
      .title {
        font-size: 24px;
        font-weight: 700;
        line-height: 20px;
        color: #fff;
      }
      .sub-title {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: #fff;
      }
      .button {
        margin-top: 10px;
        padding: 0;
        background: rgba(42, 130, 228, 1);
        width: 74px;
        border-radius: 2px;
      }
    }
    .panel-content {
      flex: 1 1 auto;
      min-height: 226px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .panel-card {
      width: 456px;
    }
    .panel-empty {
      width: 100%;
      min-height: 226px;
      background: #fff;
      border-radius: 8px;
    }
  }
</style>
