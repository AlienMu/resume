<template>
  <a-flex vertical class="my-income">
    <content-head />
    <div class="my-income-panel" style="margin-bottom: 10px">
      <a-flex justify="space-between">
        <m-tabs style="flex: 1" @change="getTableList(true)" v-model:activeKey="activeTab" size="large">
          <a-tab-pane key="total" :tab="getLabel('tabs', 1)" />
          <a-tab-pane key="records">
            <template #tab>
              <a-flex align="center" gap="5">
                <span>{{ getLabel('tabs', 2) }}</span>
                <svg-icon name="hot" />
              </a-flex>
            </template>
          </a-tab-pane>
        </m-tabs>
        <a-button type="primary" @click="handleOpenWithdraw">{{ getLabel('button', 1) }}</a-button>
      </a-flex>
    </div>
    <template v-if="activeTab === 'total'">
      <a-flex vertical gap="20" class="my-income-panel">
        <a-flex align="center" class="my-income-card">
          <a-flex style="width: 16.66%" vertical align="center" gap="10" v-for="(card, index) in summaryCards" :key="card.key">
            <span :class="['mui-font-size-20', 'mui-bold', index === summaryCards.length - 1 ? 'mui-error-text' : 'mui-title-text']">
              {{ getSummaryValue(card.value) }}
            </span>
            <span class="mui-desc-text">{{ getLabel(`total.${index}`) }}</span>
          </a-flex>
        </a-flex>
        <a-flex vertical gap="10">
          <span class="mui-desc-text mui-font-bold mui-font-space">{{ getLabel('tips.0') }}</span>
          <span class="mui-desc-text">{{ getLabel('tips.1') }}</span>
          <span class="mui-desc-text mui-font-bold mui-font-space">{{ getLabel('tips.2') }}</span>
          <span class="mui-desc-text">{{ getLabel('tips.3') }}</span>
          <span class="mui-desc-text">{{ getLabel('tips.4') }}</span>
          <span class="mui-desc-text">{{ getLabel('tips.5') }}</span>
          <span class="mui-desc-text mui-font-bold mui-font-space">{{ getLabel('tips.6') }}</span>
          <span class="mui-desc-text">{{
            getLabel('tips.7', {
              minAmount: userStore.siteConfig.minWithdrawAmount || 100,
              feeRate: userStore.siteConfig.withdrawFeeRate || 25,
            })
          }}</span>
        </a-flex>
        <div class="tab-style-text">{{ getLabel('daysAgo.0') }}</div>
        <a-flex class="my-income-card">
          <a-flex style="width: 16.66%" vertical align="center" gap="10" v-for="(item, index) in summaryDaysAgo" :key="item.key">
            <span class="mui-title-text mui-font-size-20 mui-bold">{{ getSummaryValue(item.value) }}</span>
            <span class="mui-desc-text">{{ getLabel(`daysAgo.${index}`) }}</span>
          </a-flex>
        </a-flex>
        <a-flex justify="space-between" align="center">
          <a-flex gap="8" align="center">
            <span class="tab-style-text">{{ getLabel('detailTitle', 1) }}</span>
            <span class="mui-font-size-16 mui-tip-text">{{ getLabel('detailTitle', { text: inviteName }, 2) }}</span>
          </a-flex>
          <a-flex align="center" gap="10">
            <m-form-item no-style>
              <a-range-picker v-model:value="rangePicker" value-format="YYYY-MM-DD" style="width: 250px" @change="getTableList(true)" />
            </m-form-item>
            <a-button type="primary" style="width: 130px; padding: 0" @click="handleInviteFriends">{{ getLabel('button', 2) }}</a-button>
          </a-flex>
        </a-flex>
      </a-flex>
      <a-flex vertical gap="20" style="margin-top: 20px">
        <a-table
          :columns="columns"
          :dataSource="earningsTableData"
          :loading="tableLoading"
          :pagination="false"
          :scroll="{ x: 'max-content' }"
          rowKey="id"
        />
        <m-pagination :pagination="pagination" @change="onChangeTablePage" />
      </a-flex>
    </template>
    <a-flex v-if="activeTab === 'records'" vertical gap="30">
      <a-table
        :columns="recordsColumns"
        :dataSource="withdrawTableData"
        :loading="tableLoading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        rowKey="id"
      />
      <m-pagination :pagination="pagination" @change="onChangeTablePage" />
    </a-flex>
  </a-flex>
  <withdraw-apply-modal ref="withdrawModalRef" @success="handleWithdrawSuccess" />
</template>

<script setup>
  import ContentHead from '../components/content-head.vue';
  import { columns, recordsColumns } from './columns';
  import { computed, onMounted, ref } from 'vue';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import MTabs from '/@/components/mui/m-tabs/m-tabs.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import { message } from 'ant-design-vue';
  import { getEarningsDetails, getEarningsOverview, getWithdrawList, getYesterdayEarnings } from '/@/api/invite';
  import WithdrawApplyModal from './components/withdraw-apply-modal.vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel } = useI18nText({ local: 'inviteCenter.myIncome' });

  const router = useRouter();
  const userStore = useUserStore();

  const activeTab = ref('total');

  const selectAgo = ref('Last month');

  const createOverview = () => ({
    resumeEarnings: 0,
    inviteShareEarnings: 0,
    totalEarnings: 0,
    withdrawnEarnings: 0,
    lockedEarnings: 0,
    availableEarnings: 0,
  });

  const createStatistic = () => ({
    todayEarnings: 0,
  });

  const createYesterday = () => ({
    resumeEarnings: 0,
    inviteShareEarnings: 0,
    totalEarnings: 0,
  });

  const overview = ref(createOverview());
  const statistic = ref(createStatistic());
  const yesterdayStats = ref(createYesterday());
  const summaryLoaded = ref(false);
  const rangePicker = ref([dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);

  // ------------------------ table data and query methods ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const tableLoading = ref(false);

  const earningsTableData = ref([]);
  const withdrawTableData = ref([]);

  const inviteName = ref('');

  const summaryCards = computed(() => [
    {
      key: 'resume',
      value: overview.value.resumeEarnings ?? 0,
    },
    {
      key: 'invite',
      value: overview.value.inviteShareEarnings ?? 0,
    },
    {
      key: 'total',
      value: overview.value.totalEarnings ?? 0,
    },
    {
      key: 'withdrawn',
      value: overview.value.withdrawnEarnings ?? 0,
    },
    {
      key: 'locked',
      value: overview.value.lockedEarnings ?? 0,
    },
    {
      key: 'available',
      value: overview.value.availableEarnings ?? 0,
    },
  ]);

  const summaryDaysAgo = computed(() => [
    {
      key: 'today',
      value: statistic.value.todayEarnings ?? 0,
    },
    {
      key: 'yesterdayResume',
      value: yesterdayStats.value.resumeEarnings ?? 0,
    },
    {
      key: 'yesterdayInvite',
      value: yesterdayStats.value.inviteShareEarnings ?? 0,
    },
    {
      key: 'yesterdayTotal',
      value: yesterdayStats.value.totalEarnings ?? 0,
    },
  ]);

  const normalizeInviteRewardRecord = (record = {}) => ({
    id: record.id,
    createdAt: record.time ?? '',
    amount: record.earnings ?? 0,
    level: record.shareLevel ?? '-',
    inviteChain: record.inviteChain ?? '--',
  });

  const parseAccountInfo = (info) => {
    if (!info) return '--';
    if (typeof info === 'object') {
      return info.account ?? info.address ?? info.walletAddress ?? '--';
    }
    try {
      const parsed = JSON.parse(info);
      if (parsed && typeof parsed === 'object') {
        return parsed.account ?? parsed.address ?? parsed.walletAddress ?? info;
      }
    } catch (error) {
      return info;
    }
    return info;
  };

  const normalizeWithdrawRecord = (record = {}) => ({
    id: record.id ?? '',
    createdAt: record.createdAt ?? '',
    account: parseAccountInfo(record.walletAddress ?? record.accountInfo ?? record.account),
    accountImage: record.qrcodeUrl ?? '',
    amount: record.actualAmount ?? 0,
    voucher: record.voucher ?? '',
    status: record.statusName ?? '',
    feedback: record.remark ?? '',
  });

  const getSummaryValue = (value) => {
    if (value === '' || value === null || value === undefined) {
      return '--';
    }
    return value;
  };

  const fetchSummary = async () => {
    try {
      const [overviewData, yesterdayData] = await Promise.all([getEarningsOverview(), getYesterdayEarnings()]);
      overview.value = { ...createOverview(), ...(overviewData || {}) };
      yesterdayStats.value = { ...createYesterday(), ...(yesterdayData || {}) };
      // Today's earnings (U) comes from the todayTotalEarnings field of the yesterday endpoint
      statistic.value.todayEarnings = yesterdayData?.todayTotalEarnings ?? 0;
    } catch (error) {
      message.error(error?.message || getLabel('loadFailed'));
    }
  };

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
      summaryLoaded.value = false;
    }
    if (!summaryLoaded.value) {
      await fetchSummary();
      summaryLoaded.value = true;
    }
    try {
      tableLoading.value = true;
      if (activeTab.value === 'records') {
        const data = await getWithdrawList({
          current: pagination.value.current,
          size: pagination.value.pageSize,
        });
        withdrawTableData.value = Array.isArray(data?.records) ? data.records.map((item) => normalizeWithdrawRecord(item)) : [];
        pagination.value.total = data?.total ?? 0;
        pagination.value.current = data?.current ?? pagination.value.current;
      } else {
        const data = await getEarningsDetails({
          current: pagination.value.current,
          size: pagination.value.pageSize,
          startTime: rangePicker.value?.[0],
          endTime: rangePicker.value?.[1],
        });

        inviteName.value = data.superiorInviterName ?? '';
        earningsTableData.value = Array.isArray(data?.records) ? data.records.map((item) => normalizeInviteRewardRecord(item)) : [];
        pagination.value.total = data?.total ?? 0;
        pagination.value.current = data?.current ?? pagination.value.current;
      }
    } finally {
      tableLoading.value = false;
    }
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  const withdrawModalRef = ref();

  const handleOpenWithdraw = () => {
    withdrawModalRef.value?.handleOpen({
      withdrawable: overview.value.availableEarnings ?? 0,
    });
  };

  const handleWithdrawSuccess = () => {
    summaryLoaded.value = false;
    getTableList(true);
  };

  const handleInviteFriends = () => {
    router.push('/invite-center/invite-friends');
  };

  onMounted(getTableList);
</script>

<style scoped lang="less">
  .my-income {
    padding-bottom: 30px;
    .my-income-panel {
      padding: 0 28px;
    }
    .my-income-card {
      padding: 20px;
      border-radius: 4px;
      background: rgba(242, 246, 252, 1);
    }
    .tab-style-text {
      font-size: 16px;
      font-weight: 500;
      color: @primary-color;
      letter-spacing: 0.5px;
    }
  }
</style>
<route>
{
auth: 'myIncome',
parentId: 'invite-center',
sort: 1
}
</route>
