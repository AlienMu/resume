<template>
  <div class="choice-job">
    <a-flex gap="10" align="center">
      <div class="icon"><img :src="FileImage" alt="" /></div>
      <div class="title">{{ $t('work.choice.title') }}</div>
    </a-flex>
    <a-row :gutter="12">
      <a-col v-for="(item, index) in displayRecords" :key="item?.id ?? item?._skeletonId ?? index" style="padding-top: 12px" :span="COL_SPAN">
        <job-card :data="item" :loading="item?._isSkeleton" @click="handleJobCardClick(item)" />
      </a-col>
    </a-row>
    <a-flex v-if="!isLoading && records.length === 0" align="center" justify="center">
      <m-empty />
    </a-flex>
    <a-flex justify="center" style="width: 100%; margin-top: 16px">
      <a-button type="primary" @click="router.push({ name: 'list' })" style="width: 196px" size="large">{{ $t('work.choice.more') }}</a-button>
    </a-flex>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getRecommendJobs } from '/@/api/job';
  import FileImage from '/@/assets/images/work/file.png';
  import JobCard from '/@/components/business/job-card/job-card.vue';
  import MEmpty from '/@/components/mui/m-empty/m-empty.vue';

  const COL_SPAN = 8;
  const SKELETON_COUNT = 6;
  const router = useRouter();
  const records = ref([]);
  const isLoading = ref(false);

  const createSkeletonItems = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      _isSkeleton: true,
      _skeletonId: `skeleton-${Date.now()}-${index}`,
    }));
  };

  const skeletonItems = ref(createSkeletonItems(SKELETON_COUNT));

  const displayRecords = computed(() => {
    if (isLoading.value) {
      return skeletonItems.value;
    }
    return records.value;
  });

  const getRecords = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    // 初始化时显示占位
    skeletonItems.value = createSkeletonItems(SKELETON_COUNT);
    try {
      const result = await getRecommendJobs({ current: 1, size: 6 });
      const list = Array.isArray(result?.records) ? result.records : [];
      records.value = list;
    } catch (error) {
      console.error('[work-choice-job] fetch recommend jobs failed', error);
    } finally {
      isLoading.value = false;
      skeletonItems.value = [];
    }
  };

  const handleJobCardClick = (item) => {
    if (item?._isSkeleton || !item?.id) return;
    router.push({
      name: 'list',
      query: {
        firstJobId: item.id,
      },
    });
  };

  onMounted(getRecords);
</script>

<style scoped lang="less">
  .choice-job {
    border-radius: 8px;
    margin-top: 32px;
    background: linear-gradient(180deg, rgba(184, 216, 255, 1) 0%, rgba(237, 245, 255, 1) 53.47%, rgba(255, 255, 255, 1) 100%);
    border: 1px solid rgba(255, 255, 255, 1);
    position: relative;
    padding: 20px 24px;
    overflow: hidden;
    &:before {
      content: '';
      position: absolute;
      width: 689px;
      height: 167px;
      right: 0;
      top: 0;
      background-image: url(/@/assets/images/work/choice-job-bg.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
    }
    .title {
      color: rgba(8, 43, 92, 1);
      font-weight: 700;
      font-size: 20px;
    }
    .icon {
      width: 24px;
    }
  }
</style>
