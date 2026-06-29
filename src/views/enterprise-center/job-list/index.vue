<template>
  <a-flex vertical gap="30" justify="space-between" class="job-list">
    <a-flex vertical>
      <content-head :tips="$t('enterpriseCenter.titleTips', { companyFreezeDays: userStore.siteConfig.otherItems.companyFreezeDays })">
        <a-flex gap="30">
          <m-form-item>
            <a-input
              v-model:value.trim="keyword"
              :placeholder="getLabel('placeholder', 1)"
              type="primary"
              style="width: 183px"
              size="large"
              @pressEnter="handleSearch"
            />
            <div class="search-select">
              <m-select v-model:value="statusFilter" :placeholder="getLabel('placeholder', 2)" @change="handleSearch">
                <a-select-option :value="undefined">{{ getLabel('statusAll') }}</a-select-option>
                <a-select-option :value="1">{{ getLabel('statusOpen') }}</a-select-option>
                <a-select-option :value="2">{{ getLabel('statusPaused') }}</a-select-option>
                <a-select-option :value="0">{{ getLabel('statusClosed') }}</a-select-option>
              </m-select>
            </div>
            <a-button type="link" class="search-button" @click="handleSearch">
              <svg-icon name="glass" class="search-icon" />
            </a-button>
          </m-form-item>
          <a-button @click="handleAddJob" type="primary">{{ getLabel('addJob') }}</a-button>
        </a-flex>
      </content-head>
      <a-table :columns="columns" :dataSource="tableData" :loading="tableLoading" :pagination="false" :scroll="{ x: 'max-content' }" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operate'">
            <a-flex gap="8">
              <a-button type="link" size="small" @click.stop="handleEdit(record)">{{ getLabel('operate.edit') }}</a-button>
              <a-button
                type="link"
                size="small"
                v-if="JOB_STATUS_ENUM.PAUSED.value === record.status"
                :loading="isActionLoading(record.id, 'republish')"
                @click.stop="handleRepublish(record)"
              >
                {{ getLabel('operate.republish') }}
              </a-button>
              <a-button
                type="link"
                size="small"
                v-if="JOB_STATUS_ENUM.OPEN.value === record.status"
                :loading="isActionLoading(record.id, 'pause')"
                @click.stop="handlePause(record)"
              >
                {{ getLabel('operate.pause') }}
              </a-button>
              <a-button
                type="link"
                size="small"
                v-if="JOB_STATUS_ENUM.DRAFT.value !== record.status"
                :loading="isActionLoading(record.id, 'refresh')"
                :disabled="record.canRefreshToday === false"
                @click.stop="handleRefresh(record)"
              >
                {{ getLabel('operate.refresh') }}
              </a-button>
              <a-button
                type="link"
                size="small"
                v-if="JOB_STATUS_ENUM.DRAFT.value !== record.status"
                :loading="isActionLoading(record.id, 'promote')"
                :disabled="record.canPromote === false"
                @click.stop="handlePromote(record)"
              >
                {{ getLabel('operate.promote') }}
              </a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-flex>
    <a-flex vertical gap="30">
      <m-pagination :pagination="pagination" @change="onChangeTablePage" />
      <!-- Refresh / promote modal -->
      <job-refresh-promote-modal ref="refreshPromoteModalRef" @confirm="handleModalConfirm" />
      <a-flex vertical gap="24" class="mui-tips">
        <a-flex align="center" gap="5">
          <span class="mui-primary-text"><svg-icon name="tips" /></span>
          <div class="mui-tips-title">{{ getLabel('tipsTitle') }}</div>
        </a-flex>
        <a-flex gap="8" vertical>
          <div class="mui-tips-desc">{{ getLabel('tips.0') }}</div>
          <div class="mui-tips-desc">{{ getLabel('tips.1') }}</div>
          <div class="mui-tips-desc">{{ getLabel('tips.2') }}</div>
          <div class="mui-tips-desc">{{ getLabel('tips.3') }}</div>
          <div class="mui-tips-desc">{{ getLabel('tips.4') }}</div>
        </a-flex>
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import ContentHead from '../components/content-head.vue';
  import { columns } from './columns';
  import { getCompanyJobList, republishJob, pauseJob } from '/@/api/job';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { JOB_STATUS_ENUM } from '/@/constants/api-const';
  import { useUserStore } from '/@/store/modules/system/user';
  import { useCompanyStore } from '/@/store/modules/company';
  import JobRefreshPromoteModal from '../components/job-refresh-promote-modal.vue';

  const { getLabel } = useI18nText({ local: 'enterpriseCenter.jobRecords' });
  const userStore = useUserStore();
  const companyStore = useCompanyStore();

  const router = useRouter();

  const keyword = ref('');
  const statusFilter = ref(undefined);
  const refreshPromoteModalRef = ref(null);

  // ------------------------ table data and query methods ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const tableLoading = ref(false);

  const tableData = ref([]);

  const actionLoading = reactive({});

  const getTableList = async (resetPage = false) => {
    try {
      if (resetPage) {
        pagination.value.current = 1;
      }
      tableLoading.value = true;
      const data = await getCompanyJobList({
        current: pagination.value.current,
        size: pagination.value.pageSize,
        jobTitle: keyword.value || undefined,
        status: statusFilter.value,
      });
      tableData.value = (data?.records ?? []).map((item) => ({
        ...item,
        deadTime: item.expiredAt,
        applyCount: item.applicationCount,
      }));
      pagination.value.total = data?.total ?? 0;
      pagination.value.current = data?.current ?? pagination.value.current;
      tableLoading.value = false;
    } finally {
      tableLoading.value = false;
    }
  };

  const actionKey = (id, action) => `${id}-${action}`;

  const setActionLoading = (id, action, value) => {
    actionLoading[actionKey(id, action)] = value;
  };

  const isActionLoading = (id, action) => Boolean(actionLoading[actionKey(id, action)]);

  const handleSearch = () => {
    getTableList(true);
  };

  const handleAddJob = async () => {
    // Check whether the company profile is complete
    if (!companyStore.hasFetchedCompanyInfo) {
      // If company info has not been fetched yet, fetch it first
      try {
        await companyStore.fetchCompanyInfo();
      } catch (error) {
        message.error('Failed to load company info, please try again');
        return;
      }
    }

    if (!companyStore.checkCompanyInfoComplete()) {
      return;
    }
    router.push({ name: 'job-edit' });
  };

  const handleEdit = (record) => {
    router.push({ name: 'job-edit', query: { id: record.id } });
  };

  const handleRepublish = async (record) => {
    const key = 'republish';
    try {
      setActionLoading(record.id, key, true);
      await republishJob(record.id);
      message.success(getLabel('message.republishSuccess'));
      await getTableList();
    } finally {
      setActionLoading(record.id, key, false);
    }
  };

  const handlePause = async (record) => {
    const key = 'pause';
    try {
      setActionLoading(record.id, key, true);
      await pauseJob(record.id);
      message.success(getLabel('message.pauseSuccess'));
      await getTableList();
    } finally {
      setActionLoading(record.id, key, false);
    }
  };

  const handleRefresh = (record) => {
    if (record.canRefreshToday === false) {
      return;
    }
    refreshPromoteModalRef.value?.open({
      type: 'refresh',
      record,
    });
  };

  const handlePromote = (record) => {
    if (record.canPromote === false) {
      return;
    }
    refreshPromoteModalRef.value?.open({
      type: 'promote',
      record,
    });
  };

  const handleModalConfirm = async () => {
    await getTableList();
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  onMounted(getTableList);
</script>

<style scoped lang="less">
  .job-list {
    height: 100%;
    overflow: hidden;
    padding-bottom: 30px;
  }

  .search-select {
    border-left: 1px solid @border-color;
    width: 100px;
  }
  .search-button {
    padding: 4px 12px;
    line-height: 35px;
    border-left: 1px solid @border-color;
  }
  .search-icon {
    font-size: 18px;
    color: @primary-color;
  }
</style>
<route>
{
auth: 'jobList',
parentId: 'enterprise-center',
sort: 1
}
</route>
