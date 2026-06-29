<template>
  <div class="work-bg" ref="containerRef">
    <div v-if="!isMobileDevice" class="danmaku-container">
      <div
        v-for="danmaku in danmakuList"
        :key="danmaku.id"
        class="danmaku-item"
        :style="{
          fontSize: `${danmaku.fontSize}px`,
          color: danmaku.color,
          top: trackCount > 1 ? (danmaku.track === 0 ? '0%' : `${(danmaku.track * 50) / (trackCount - 1)}%`) : '50%',
          left: `${danmaku.left}%`,
          transform: danmaku.track === 0 ? 'translateY(0)' : 'translateY(-50%)',
        }"
      >
        {{ danmaku.text }}
      </div>
    </div>
    <div class="work">
      <a-flex justify="center">
        <div class="title">{{ $t('work.title') }}</div>
      </a-flex>
      <div class="work-content">
        <work-search />
        <choice-job />
        <work-banner />
        <work-panel
          v-for="(panel, index) in workPanels"
          :key="panel.key"
          :searchKey="panel.industry"
          :title="panel.title"
          :sub-title="panel.subTitle"
          :records="panel.records"
          :loading="panel.loading"
          :panel-index="index + 1"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import WorkSearch from './components/work-search.vue';
  import ChoiceJob from './components/choice-job.vue';
  import WorkBanner from './components/work-banner.vue';
  import WorkPanel from './components/work-panel.vue';
  import { useDanmaku } from '/@/hooks/use-danmaku';
  import { isMobile } from '/@/utils/common';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { computed, onMounted, ref } from 'vue';
  import { listJobs } from '/@/api/job';
  import { useHead } from '@vueuse/head';

  // SEO optimization - dynamically set meta tags
  useHead({
    title: 'WebJob - Overseas Jobs & Recruitment Platform | Web3 Blockchain, iGaming, Southeast Asia Remote Work',
    meta: [
      {
        name: 'description',
        content:
          'WebJob is a professional overseas job search and recruitment platform, offering positions in Web3 blockchain, iGaming, crypto exchanges and more. Covering the Philippines, Thailand, Malaysia, Dubai, Singapore and other regions across Southeast Asia, with support for remote and work-from-home roles. We provide Solidity smart contract development opportunities, work visa assistance and other services to power global careers.',
      },
      {
        name: 'keywords',
        content:
          'overseas jobs, work abroad, overseas job search, overseas recruitment, Web3 jobs, blockchain recruitment, iGaming recruitment, Southeast Asia jobs, Philippines jobs, Thailand jobs, Malaysia jobs, Dubai jobs, Singapore jobs, remote work, work from home, Solidity development, smart contracts, crypto exchange, working abroad, work visa, flights included, accommodation included',
      },
      {
        property: 'og:title',
        content: 'WebJob - Overseas Jobs & Recruitment Platform | Web3 Blockchain, iGaming, Southeast Asia Remote Work',
      },
      {
        property: 'og:description',
        content:
          'A professional overseas job search and recruitment platform, offering positions in Web3 blockchain, iGaming, crypto exchanges and more. Covering Southeast Asia, Dubai, Singapore and other regions, with support for remote and work-from-home roles.',
      },
    ],
  });

  const isMobileDevice = isMobile();
  const danmakuResult = isMobileDevice
    ? { danmakuList: ref([]), containerRef: ref(null), trackCount: ref(0) }
    : useDanmaku({
        baseSpeed: 30, // Moves 0.3% of the screen width per second, taking about 200 seconds to cross the entire screen
        trackCount: 5,
      });
  const { danmakuList, containerRef, trackCount } = danmakuResult;

  const { getLabel } = useI18nText({ local: 'work.panels' });

  // Configuration for the four fixed sections
  const panelConfigs = [
    {
      key: 'web3',
      industry: 'industry_sector:web3',
      titleKey: 'web3.title',
      subTitleKey: 'web3.subTitle',
    },
    {
      key: 'internet',
      industry: 'industry_sector:internet',
      titleKey: 'internet.title',
      subTitleKey: 'internet.subTitle',
    },
    {
      key: 'finance',
      industry: 'industry_sector:finance',
      titleKey: 'finance.title',
      subTitleKey: 'finance.subTitle',
    },
    {
      key: 'other',
      industry: 'industry_sector:other',
      titleKey: 'other.title',
      subTitleKey: 'other.subTitle',
    },
  ];

  // Data for the four fixed sections
  const workPanels = ref(
    panelConfigs.map((config) => ({
      key: config.key,
      title: getLabel(config.titleKey),
      subTitle: getLabel(config.subTitleKey),
      records: [],
      loading: false,
      industry: config.industry,
    }))
  );

  // Fetch data for a single panel
  const fetchPanelData = async (panel) => {
    if (panel.loading) return;
    panel.loading = true;
    try {
      const result = await listJobs({
        current: 1,
        size: 4,
        industry: panel.industry,
      });
      const records = Array.isArray(result?.records) ? result.records : [];
      panel.records = records.slice(0, 4);
    } catch (error) {
      console.error(`[work-panel] fetch ${panel.key} jobs failed`, error);
      panel.records = [];
    } finally {
      panel.loading = false;
    }
  };

  // Fetch data for all panels
  const fetchAllPanelsData = async () => {
    await Promise.all(workPanels.value.map((panel) => fetchPanelData(panel)));
  };

  onMounted(() => {
    fetchAllPanelsData();
  });
</script>
<style lang="less" scoped>
  .work-bg {
    position: relative;
  }

  .danmaku-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    pointer-events: none;
    z-index: 1;
  }

  .danmaku-item {
    position: absolute;
    white-space: nowrap;
    user-select: none;
    font-weight: 500;
    will-change: left;
  }

  .work {
    position: relative;
    z-index: 2;
    max-width: 1440px;
    margin: 0 auto;

    .title {
      color: #fff;
      font-size: 32px;
      font-weight: 700;
      padding-top: 80px;
      margin-bottom: 23px;
    }
  }
</style>
<route>
{
parentId: 0,
auth: 'home',

}
</route>
