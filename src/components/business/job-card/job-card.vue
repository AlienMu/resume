<template>
  <a-card v-if="loading" :bordered="false" class="job-card-wrap job-card-skeleton">
    <template #cover>
      <div class="job-card">
        <a-flex align="center" justify="space-between" class="job-card-skeleton__head">
          <a-skeleton-input active style="width: 60%; font-size: 0" size="small" />
          <a-skeleton-input active style="width: 80px; overflow: hidden; font-size: 0" size="small" />
        </a-flex>
        <a-flex class="job-card-skeleton__tags" align="center" gap="8">
          <a-skeleton-button style="font-size: 0" v-for="tag in 5" :key="tag" active size="small" shape="round" />
        </a-flex>
        <a-flex class="job-card-skeleton__highlights" gap="8">
          <a-skeleton-button v-for="tag in 2" style="font-size: 0" :key="`highlight-${tag}`" active size="small" />
        </a-flex>
      </div>
    </template>
  </a-card>
  <a-card
    v-else
    :bordered="false"
    hoverable
    @click="emit('click', data)"
    :class="{ active: activated, viewed: viewed && !activated }"
    class="job-card-wrap"
  >
    <template #cover>
      <div class="job-card">
        <a-flex align="center" gap="16" justify="space-between">
          <a-typography-text class="title" :content="data.jobTitle" :title="data.jobTitle" />
          <div class="price">{{ data.salaryRange }}</div>
        </a-flex>
        <div class="tags">
          <a-flex align="center" gap="8" wrap="nowrap" class="tags-row">
            <div class="tags-item">
              {{ data.country }}
            </div>
            <div class="tags-line"></div>
            <div class="tags-item">
              {{ data.workExperienceShow }}
            </div>
            <div class="tags-line"></div>
            <div class="tags-item">
              {{ data.educationRequiredShow }}
            </div>
            <div class="tags-line"></div>
            <div class="tags-item">
              {{ data.recruitmentNumberShow }}
            </div>
            <div class="tags-line"></div>
            <div class="tags-item">
              {{ getTimeComparison(data.refreshAt) }}
            </div>
          </a-flex>
        </div>
        <div class="color-tags">
          <a-flex>
            <color-tag>{{ data.industryShow }}</color-tag>
            <color-tag type="ghost" v-if="data.jobNatureShow">{{ data.jobNatureShow }}</color-tag>
          </a-flex>
        </div>
      </div>
    </template>
  </a-card>
</template>

<script setup>
  import ColorTag from '/@/components/support/color-tag/color-tag.vue';
  import { getTimeComparison } from '/@/utils/date-util';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        highlights: [],
      }),
    },
    activated: Boolean,
    viewed: Boolean,
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);
</script>

<style scoped lang="less">
  .job-card-wrap {
    border-radius: 8px;
    position: relative;
    :deep(.ant-card-cover) {
      position: relative;
      z-index: 2;
    }
    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      border: 1px solid rgba(230, 237, 242, 1);
    }
    &.active {
      position: relative;
      &:before {
        border: 1.5px solid @primary-color;
      }
    }
    &.viewed {
      .title,
      .price,
      .tags-item {
        color: @font-tip-color !important;
      }
    }
  }
  .job-card {
    padding: 16px 20px 16px 20px;

    .title {
      color: @font-primary-color;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price {
      color: @error-color;
    }
    .title,
    .price {
      font-weight: 700;
      font-size: 16px;
    }

    .tags {
      padding-top: 12px;
      overflow: hidden;
      .tags-row {
        overflow: hidden;
      }
      .tags-item {
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        color: @font-desc-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 0;
      }
      .tags-item:last-child {
        flex-shrink: 1;
        min-width: 0;
      }
      .tags-line {
        width: 1px;
        height: 10px;
        flex-shrink: 0;
        background: rgba(204, 204, 204, 1);
      }
    }
    .color-tags {
      padding-top: 8px;
    }
  }
  .job-card-skeleton {
    border-radius: 8px;

    box-sizing: border-box;
    background: #fff;
    .job-card-skeleton__tags {
      padding-top: 16px;
    }
    .job-card-skeleton__highlights {
      padding-top: 8px;
    }
    :deep(.ant-skeleton-input),
    :deep(.ant-skeleton-button) {
      height: 16px;
    }
  }
</style>
