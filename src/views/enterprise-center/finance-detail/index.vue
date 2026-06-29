<template>
  <div class="finance-detail-wrapper">
    <a-flex vertical class="finance-detail">
      <content-head />
      <!-- My recruitment package -->
      <div class="package-card">
        <div class="package-title">{{ getLabel('packageTitle') }}</div>
        <a-flex justify="space-between" align="center" class="package-info">
          <a-flex gap="130" align="center">
            <a-flex vertical gap="8" class="info-item">
              <a-flex align="center" gap="8">
                <svg-icon name="file" class="info-icon" />
                <span class="info-label">{{ getLabel('packageCompany') }}</span>
              </a-flex>
              <span class="info-value">{{ packageInfo.companyName || '-' }}</span>
            </a-flex>
            <a-flex vertical gap="8" class="info-item">
              <a-flex align="center" gap="8">
                <ClockCircleOutlined class="info-icon" />
                <span class="info-label">{{ getLabel('packageTime') }}</span>
              </a-flex>
              <span class="info-value">{{ formatDateRange(packageInfo.validityStartTime, packageInfo.validityEndTime) }}</span>
            </a-flex>
            <a-flex gap="8" vertical class="info-item">
              <a-flex align="center" gap="8">
                <DollarOutlined class="info-icon" />
                <span class="info-label">{{ getLabel('packageBalance') }}</span>
              </a-flex>
              <span class="info-value">{{ formatBalance(packageInfo.packageBalance) }} USDT</span>
            </a-flex>
          </a-flex>
          <a-button type="primary" @click="handleRecharge">{{ getLabel('rechargeButton') }}</a-button>
        </a-flex>
      </div>

      <!-- Finance details -->
      <div class="detail-card">
        <a-flex justify="space-between" align="center" class="detail-header">
          <div class="detail-title">{{ getLabel('detailTitle') }}</div>
          <a-select
            v-model:value="filters.type"
            :placeholder="getLabel('selectPlaceholder')"
            allow-clear
            :options="typeOptions"
            style="width: 150px"
            @change="handleSearch"
          />
        </a-flex>
        <a-flex vertical gap="30">
          <a-table
            :columns="columns"
            :dataSource="tableData"
            :loading="tableLoading"
            :pagination="false"
            rowKey="id"
            :scroll="{ x: 'max-content' }"
          />
          <m-pagination :pagination="pagination" @change="onChangeTablePage" />
        </a-flex>
      </div>
    </a-flex>
  </div>
</template>

<script setup>
  import { computed, h, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';
  import { ClockCircleOutlined, DollarOutlined } from '@ant-design/icons-vue';
  import ContentHead from '../components/content-head.vue';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { FINANCE_TRANSACTION_TYPE_ENUM } from '/@/constants/api-const';
  import { getCompanyPackageDetail, getFinanceTransactionList } from '/@/api/company';
  import { getColumn } from '/@/utils/desc-util';

  const router = useRouter();
  const { getLabel } = useI18nText({ local: 'enterpriseCenter.financeDetail' });

  const columns = computed(() => [
    getColumn({
      title: getLabel('columns.0'),
      dataIndex: 'orderNo',
      width: 180,
    }),
    getColumn({
      title: getLabel('columns.1'),
      dataIndex: 'itemName',
      width: 160,
    }),
    getColumn({
      title: getLabel('columns.2'),
      dataIndex: 'amount',
      width: 120,
      customRender: ({ text, record }) => {
        const type = record?.type;
        const isConsumeOrWithdraw = type === FINANCE_TRANSACTION_TYPE_ENUM.CONSUME.value || type === FINANCE_TRANSACTION_TYPE_ENUM.WITHDRAW.value;
        const displayAmount = isConsumeOrWithdraw ? `-${formatAmount(text)}` : `+${formatAmount(text)}`;
        const color = isConsumeOrWithdraw ? '#ff4d4f' : '#52c41a';
        return h('span', { style: { color } }, displayAmount);
      },
    }),
    getColumn({
      title: getLabel('columns.3'),
      dataIndex: 'balanceAfter',
      width: 120,
    }),
    getColumn({
      title: getLabel('columns.4'),
      dataIndex: 'transactionTime',
      width: 180,
    }),
  ]);

  const typeOptions = Object.values(FINANCE_TRANSACTION_TYPE_ENUM).map((item) => ({
    label: item.desc,
    value: item.value,
  }));

  const packageInfo = ref({
    companyName: '',
    validityStartTime: '',
    validityEndTime: '',
    packageBalance: 0,
  });

  const filters = reactive({
    type: undefined,
  });

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const tableLoading = ref(false);
  const tableData = ref([]);

  const formatDate = (date) => {
    if (!date) return '--';
    return dayjs(date).format('YYYY-MM-DD');
  };

  const formatDateRange = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '--';
    const end = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '--';
    if (start === '--' && end === '--') return '--';
    return `${start} ~ ${end}`;
  };

  const formatBalance = (value) => {
    if (value === null || value === undefined || value === '') return '0';
    const num = Number(value);
    return Number.isNaN(num) ? '0' : num.toFixed(2);
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') return '--';
    const num = Number(value);
    return Number.isNaN(num) ? '--' : num.toFixed(2);
  };

  const getPackageDetail = async () => {
    try {
      const data = await getCompanyPackageDetail();
      if (data) {
        packageInfo.value = {
          companyName: data.companyName || '--',
          validityStartTime: data.validityStartTime || '',
          validityEndTime: data.validityEndTime || '',
          packageBalance: data.packageBalance || 0,
        };
      }
    } catch (error) {
      message.error(error?.message || getLabel('packageLoadFailed'));
    }
  };

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    try {
      tableLoading.value = true;
      const params = {
        current: pagination.value.current,
        size: pagination.value.pageSize,
      };
      // Only pass the type parameter when a type is selected
      if (filters.type !== undefined && filters.type !== null) {
        params.type = filters.type;
      }
      const data = await getFinanceTransactionList(params);
      const records = Array.isArray(data?.records) ? data.records : [];
      tableData.value = records.map((item, index) => ({
        id: item.id ?? `${item.type}-${index}`,
        orderNo: item.orderNo,
        itemName: item.itemName,
        amount: item.amount ?? 0,
        balanceAfter: formatAmount(item.balanceAfter),
        transactionTime: item.transactionTime ? dayjs(item.transactionTime).format('YYYY-MM-DD HH:mm:ss') : '--',
        type: item.type,
      }));
      pagination.value.total = data?.total || 0;
    } finally {
      tableLoading.value = false;
    }
  };

  const handleSearch = () => {
    getTableList(true);
  };

  const handleRecharge = () => {
    router.push('/enterprise-center/prepaid-plan');
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  onMounted(() => {
    getPackageDetail();
    getTableList();
  });
</script>

<style scoped lang="less">
  .finance-detail-wrapper {
    transform-origin: top left;
  }

  .finance-detail {
    .package-card {
      border-top: 1px solid @border-color;
      border-bottom: 1px solid @border-color;
      padding: 24px 36px;
      .package-title {
        font-size: 18px;
        font-weight: 700;
        color: @font-sub-color;
        margin-bottom: 20px;
      }

      .package-info {
        .info-item {
          .info-icon {
            font-size: 16px;
            color: @primary-color;
          }

          .info-label {
            font-size: 14px;
            color: @font-desc-color;
          }

          .info-value {
            font-size: 14px;
            text-indent: 26px;
            color: @font-sub-color;
            font-weight: 500;
          }
        }
      }
    }

    .detail-card {
      padding-bottom: 30px;
      .detail-header {
        margin-bottom: 16px;
        padding: 24px 36px 0;
        .detail-title {
          font-size: 16px;
          font-weight: 600;
          color: @font-sub-color;
        }
      }
    }
  }
</style>

<route>
{
auth: 'financeDetail',
parentId: 'enterprise-center',
sort: 3
}
</route>
